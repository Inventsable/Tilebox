// alert('Hello there')
var dest = null;
var dump = null;
var rx = {
    z: /\{z\}/i,
    x: /\{x\}/i,
    y: /\{y\}/i
};
var options = {
    size: 256,
    ext: '.png',
    min: 0,
    max: 5,
    path: null,
    pattern: null
};
function setDest(path) {
    dest = path;
}
function setDump(path) {
    dump = path;
}
function readArtboards(opts) {
    opts = JSON.parse(opts);
    setOptions(opts);
    var rx = new RegExp(opts.keyword, "i");
    var doc = app.activeDocument;
    var targs = [];
    for (var i = 0; i < doc.artboards.length; i++) {
        // if artboard name has keyword
        if (rx.test(doc.artboards[i].name)) {
            targs.push(i);
        }
    }
    JSXEvent(targs.length, 'startload');
    var message = [];
    for (var t = 0; t < targs.length; t++) {
        var index = targs[t];
        var ab = doc.artboards[index];
        // if artboard width is evenly divisible by defined tile size
        if ((isInt((ab.artboardRect[2] - ab.artboardRect[0]) / opts.size))
            // and artboard is a square
            && ((ab.artboardRect[2] - ab.artboardRect[0]) == (ab.artboardRect[1] - ab.artboardRect[3]))) {
            var map = {
                name: ab.name,
                index: index,
                width: ab.artboardRect[2] - ab.artboardRect[0],
                height: ab.artboardRect[1] - ab.artboardRect[3],
                pos: ab.artboardRect,
                tilecount: null,
                tilerows: null,
                checked: false
            };
            map.tilerows = map.width / 256;
            map.tilecount = Math.pow(map.tilerows, 2);
            message.push(map);
            generatePreview(index);
        }
    }
    return JSON.stringify(message);
}
function generatePreview(index) {
    // not necessary with screen capture, doesn't use active artboard.
    // fitin command flashes to end, artboards don't snap in sequence
    // app.activeDocument.artboards.setActiveArtboardIndex(index);
    // app.executeMenuCommand("fitin");
    var fileSpec = new File(dest + index + '.png');
    try {
        app.activeDocument.imageCapture(fileSpec, app.activeDocument.artboards[index].artboardRect);
    }
    catch (err) {
        alert(err);
    }
    finally {
        JSXEvent(index, 'step');
    }
}
function setOptions(opts) {
    options.ext = opts.ext;
    options.size = opts.size;
    options.max = opts.max;
    options.min = opts.min;
    options.path = opts.path;
    options.pattern = opts.pattern;
    // showOptions();
}
function showOptions() {
    console.log(options.ext + " \r\n" + options.size + " \r\n" + options.max + " \r\n" + options.min + " \r\n" + options.path + " \r\n" + options.pattern);
}
function exportTilemap(opts) {
    opts = JSON.parse(opts);
    setOptions(opts);
    for (var i = 0; i < opts.boards.length; i++)
        exportTileBoard(opts.boards[i]);
    var message = 'Exporting complete';
    return true;
}
function exportTileBoard(board) {
    for (var i = 0; i < board.grid.length; i++) {
        var cell = board.grid[i];
        exportTile(cell.name, options.path, cell.rect);
    }
}
function exportTile(name, path, rect) {
    var fileSpec = new File(path + name);
    try {
        app.activeDocument.imageCapture(fileSpec, rect);
    }
    catch (err) {
        console.log(err);
    }
    finally {
        console.log("Exported > " + path + name + ' at ' + rect.join());
    }
}
function isInt(value) {
    var x;
    return isNaN(value) ? !1 : (x = parseFloat(value), (0 | x) === x);
}
// function JSXEvent(payload, eventType) {
//     try {
//         var xLib = new ExternalObject("lib:\PlugPlugExternalObject");
//     } catch (e) {
//         JSXEvent(e, 'console')
//     }
//     if (xLib) {
//         var eventObj = new CSXSEvent();
//         eventObj.type = eventType;
//         eventObj.data = payload;
//         eventObj.dispatch();
//     }
//     return;
// }
