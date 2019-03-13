<template>
  <v-app dark>
    <navbar />
    <messenger ref="snack" />
    <v-content id="content">
      <router-view />
    </v-content>
    <bottomnav v-show="bottomNav" />
    <bottomanim ref="anim" />
  </v-app>
</template>

<script>
import navbar from './components/navbar'
import bottomnav from './components/bottomnav'
import bottomanim from './components/bottomanim'
import messenger from './components/messenger'

export default {
  name: 'App',
  components: {
    messenger,
    navbar,
    bottomnav,
    bottomanim,
  },
  data: () => ({
    macOS: false,
    bottomNav: false,
    sheet: true,
    cs: window.__adobe_cep__,
    // localhost: null,
    csInterface: null,
    boards: [],
    boardcount: 0,
    message: 'Loading...',
    stored: ['size', 'keyword', 'ext', 'max', 'min', 'pattern', 'path'],
    exponents: [],
    context: {
      menu: [
        { id: "scan", label: "Scan artboards", enabled: true, checkable: false, checked: false, },
        { id: "refresh", label: "Refresh panel", enabled: true, checkable: false, checked: false, },
        { label: "---" },
        { id: "localhost", label: "Launch debug", enabled: true, checkable: false, checked: false, },
        { id: "resetoptions", label: "Reset options to default", enabled: true, checkable: false, checked: false, },
      ]
    },
    rx: {
      z: /\{z\}/i,
      x: /\{x\}/i,
      y: /\{y\}/i,
    },
    opts: {
      size: null,
      keyword: null,
      ext: null,
      max: null,
      min: null,
      path: null,
      pattern: null,
      preview: null,
    },
    fake: [
      {name: "zoom0", width: 256, height: 256, tilecount: 1, tilerows: 1, checked: false},
      {name: "zoom1", width: 512, height: 512, tilecount: 4, tilerows: 2, checked: false},
      {name: "zoom2", width: 1024, height: 1024, tilecount: 16, tilerows: 4, checked: false},
      {name: "zoom3", width: 2048, height: 2048, tilecount: 64, tilerows: 8, checked: false},
    ],
  }),
  mounted() {
    this.csInterface = new CSInterface;
    window.csExtra = new CSInterface;
    this.loadUniversalScripts();
    if (navigator.platform.indexOf('Win') > -1) { this.macOS = false; } else if (navigator.platform.indexOf('Mac') > -1) { this.macOS = true; }
    this.root = this.csInterface.getSystemPath(SystemPath.EXTENSION);
    this.preview = `${this.root}/preview/`
    this.csInterface.evalScript(`setDest('${this.preview}')`)
    this.$refs.anim.start();
    this.getStorage();
    this.getPowers();
    this.setContextMenu();

  },
  computed: {
    fileType() { return '.' + this.opts.ext.toLowerCase(); },
    menuString() { return JSON.stringify(this.context); },
    localhost() {
      const debug = window.cep.fs.readFile(`${this.csInterface.getSystemPath(SystemPath.EXTENSION)}/.debug`);
      const port = new RegExp(`\\<Host\\sName\\=\\"${this.csInterface.hostEnvironment.appName}\\"\\sPort\\=\\"(\\d*)`);
      return `http://localhost:${debug.data.match(port)[1]}`;
    },
    realBoards() {
      let mirror = [];
      this.boards.forEach(board => {
        board.grid.forEach(cell => {
          let str = this.opts.pattern + this.fileType;
          str = str.replace(this.rx.z, cell.z);
          str = str.replace(this.rx.x, cell.x);
          str = str.replace(this.rx.y, cell.y);
          str = str.replace(/\.{2,}/, '.');
          cell.name = str;
        })
        mirror.push(board)
      }) 
      return mirror;
    }
  },
  methods: {    
    setContextMenu() {
      this.csInterface.setContextMenuByJSON(this.menuString, this.contextMenuClicked);
    },
    contextMenuClicked(id) {
      if (id == 'refresh')
        location.reload()
      else if (id == 'scan')
        this.readBoards();
      else if (id == 'localhost')
        cep.util.openURLInDefaultBrowser(this.localhost);
    },
    prepExports() {
      let mirror = [];
      this.boards.forEach(board => {
        board.grid.forEach(cell => {
          let str = this.opts.pattern + this.fileType;
          str = str.replace(this.rx.z, cell.z);
          str = str.replace(this.rx.x, cell.x);
          str = str.replace(this.rx.y, cell.y);
          str = str.replace(/\.{2,}/, '.');
          cell.name = str;
        })
        if (board.checked)
          mirror.push(board)
      }) 
      return mirror;
    },
    altExport() {
      console.log('ALTERNATIVE EXPORT')
    },
    startExport() {
      // console.log('Exporting...');
      // console.log(this.prepExports());
      this.$refs.anim.startScan();
      let opts = JSON.stringify({
        boards: this.prepExports(),
        ext: this.fileType,
        keyword: this.opts.keyword,
        max: this.opts.max,
        min: this.opts.min,
        path: this.getRealPath(),
        pattern: this.opts.pattern,
        size: this.opts.size,
      });
      console.log(opts);
      this.csInterface.evalScript(`exportTilemap('${opts}')`, (msg) => {
        // console.log(msg);
        console.log('Done!')
        this.$refs.anim.stopScan();
        this.snackMessage('Done!')
        // msg = JSON.parse(msg);
        // console.log(msg)
      //   this.boards = msg;
      //   this.constructGrids();
      });
      // this.$refs.anim.endScan();

    },
    snackMessage(msg) {
      console.log(msg);
      this.message = msg;
      this.$refs.snack.show();
    },
    getRealPath() {
      let trailcheck = /[^\/|\\]$/;
      if (trailcheck.test(this.opts.path))
        this.opts.path = this.opts.path + '/'
      if (!this.macOS && this.opts.path) {
        return this.opts.path.split('\\').join('\/');
      } else {
        return this.opts.path;
      }
    },
    findZoomLevel(num) {
      for (let i = 0; i < this.exponents.length; i++) {
        const exp = this.exponents[i];
        if (i > 0) {
          if (Math.sqrt(exp) == num)
            return i;
        } else {
          if (exp == num)
            return 0;
        }
      }
    },
    getPowers() {
      for (let i = 0; i < 10; i++)
        this.exponents.push(Math.pow(4, i))
      // console.log(this.exponents);
    },
    getStorage() {
      this.stored.forEach(option => {
        this.opts[option] = window.localStorage.getItem(option);
      })
    },
    clearBoards() {
      while (this.boards.length)
        this.boards.pop();
    },
    readBoards() {
      this.clearBoards();
      this.$refs.anim.startScan();
      let keyword = this.opts.keyword;
      let opts = JSON.stringify({
        ext: this.fileType,
        keyword: this.opts.keyword,
        max: this.opts.max,
        min: this.opts.min,
        path: this.getRealPath(),
        pattern: this.opts.pattern,
        size: this.opts.size,
      })
      console.log(opts);
      this.csInterface.evalScript(`readArtboards('${opts}')`, (msg) => {
        msg = JSON.parse(msg);
        this.boards = msg;
        this.constructGrids();

      });
      console.log(this.boards);
      this.$refs.anim.endScan();
    },
    loadUniversalScripts() {
      this.csInterface.evalScript(`$.evalFile('${this.csInterface.getSystemPath(SystemPath.EXTENSION)}/src/host/universal/json2.jsx')`)
      this.csInterface.evalScript(`$.evalFile('${this.csInterface.getSystemPath(SystemPath.EXTENSION)}/src/host/universal/Console.jsx')`)
      this.csInterface.evalScript(`$.evalFile('${this.csInterface.getSystemPath(SystemPath.EXTENSION)}/src/host/ILST/host.jsx')`)
    },
    constructGrids() {
      this.boards.forEach(board => {
        board.zoomLevel = this.findZoomLevel(board.width/this.opts.size);
        let mirror = [];
        for (let i = 0; i < board.tilecount; i++) {
          let column = i % board.tilerows;
          let row = (i >= board.tilerows) ? Math.floor(i/board.tilerows) : 0;
          let x1 = (column * this.opts.size) + board.pos[0];
          let y1 = (row * this.opts.size)*-1 - board.pos[1];
          if (y1 === -0)
            y1 = 0;
          let x2 = (+x1) + (+this.opts.size);
          let y2 = y1 - this.opts.size;
          let quad = null;
          if (column + 1 > (board.tilerows/2)) {
            // targ is E
            if (row + 1 > (board.tilerows/2)) {
              quad = 3;
            } else {
              quad = 1;
            }
          } else {
            if (row + 1 > (board.tilerows/2)) {
              quad = 2;
            } else {
              quad = 0;
            }
            // targ is W
          }
          mirror.push({
            name: null,
            x: column,
            y: row,
            z: board.zoomLevel,
            quadrant: quad,
            exists: false,
            selected: false,
            hover: false,
            rect: [x1, y1, x2, y2],
          });
          // console.log(`calculated zoom: ${board.zoomLevel}, tile ${i} at column ${column}, row ${row} has rect: [${x1}, ${y1}, ${x2}, ${y2}]`)
        }
        board.grid = mirror;
      });
      console.log(this.boards);
    }
  },
}
</script>

<style>
:root {
  --color-bg: #323232;
  --color-selection: #46a0f5;
  --color-hover: rgba(255,255,225,.2);
  --color-icon: #b7b7b7;
  --color-scrollbar: #2a2a2a;
  --color-scrollbar-thumb: #3e3e3e;
  --color-scrollbar-thumb-hover: #525252;
  --scrollbar-width: 14px;
  --scrollbar-thumb-width: 14px;
  --scrollbar-thumb-radius: 20px;

  --content-height-offset: 139px;
  --content-height: calc(100vh - var(--content-height-offset));
}

body::-webkit-scrollbar {
  display: none;
}

/* ::-webkit-scrollbar {
  display: none;
} */

.theme--dark.application {
  background: var(--color-bg);
}


.v-content__wrap {
  height: var(--content-height);
  /* border: 2px solid red; */
  overflow-y: auto;
}


::-webkit-scrollbar {
  background-color: var(--color-scrollbar);
  width: var(--scrollbar-width);
}
::-webkit-scrollbar-thumb {
  width: var(--scrollbar-width);
  background: var(--color-scrollbar-thumb);
  border-radius: var(--scrollbar-thumb-radius);
}
::-webkit-scrollbar-thumb:hover {
  background: var(--color-scrollbar-thumb-hover);
}
::-webkit-scrollbar-resizer{
  display: none;
}
::-webkit-scrollbar-button {
  height: 0px;
}
</style>
