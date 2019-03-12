# Tilebox prototype

## Lightweight snapshot-based tile generation:

![export options](https://thumbs.gfycat.com/AmpleWindingFairyfly-size_restricted.gif)
*Doesn't modify document properties, artboards, layers or your art.*

## Dynamic settings
* Custom pattern definition to support any mapping framework like Google Maps, Leaflet.js, Mapbox, etc.
* File type
* Output path
* Size of tile in pixels
* `Keyword` is the phrase within each artboard name to be considered as a tilemap for scanning and previewing 
* `Zoom Range` min/max sliders from `zoom 0` to `zoom 6` (producing 4096 tiles)

![](https://thumbs.gfycat.com/MadeupThornyBarnacle-size_restricted.gif)
*Only artboards that are evenly divisible by the tile size, contain the `Keyword`, and are equirectangular will be rendered to the list.*

## Zoom level 4 at 256 tiles:

![](https://thumbs.gfycat.com/BraveBelatedBrocketdeer-size_restricted.gif)