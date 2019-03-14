# Tilebox prototype

## Lightweight snapshot-based tile generation:

![export options](https://thumbs.gfycat.com/AmpleWindingFairyfly-size_restricted.gif)

*Doesn't modify document properties, artboards, layers or your art.*

## Live Preview and Diagnostic screen

### Selection supports click drag, holding shift key for quadrant select, prompt to add missing tiles or all:

![](https://thumbs.gfycat.com/QuarterlyAngryBongo-size_restricted.gif)

### Real-time file syncing with `Output Path` displays existing tiles in green and missing in red:

![](https://thumbs.gfycat.com/DeepSoggyFlyingfox-size_restricted.gif)

### Persistent selection across multiple zoom levels:

![](https://thumbs.gfycat.com/CrispPortlyHorse-size_restricted.gif)

## Dynamic settings
* Custom pattern definition to support any mapping framework like Google Maps, Leaflet.js, Mapbox, etc.
* File type
* Output path
* Size of tile in pixels
* `Keyword` is the phrase within each artboard name to be considered as a tilemap for scanning and previewing 
* `Zoom Range` min/max sliders from `zoom 0` to `zoom 6` (producing 4096 tiles)

![](https://thumbs.gfycat.com/MadeupThornyBarnacle-size_restricted.gif)

*Only artboards that are evenly divisible by the tile size, contain the `Keyword`, and are equirectangular will be rendered to the list.*