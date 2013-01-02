canvasbuddy.js
==============

#### HTML5 Canvas utilities ####

The aim of canvasbuddy.js is to simplify complex canvas operations like cropping, copying pixel data across canvas, video, image and ImageData objects.
Please note that these methods:
 
* Are CPU intensive and should not be called on every frame (like in a render / update loop)
* Will not work if any sources are tainted with cross domain data (an exception is thrown)
* Will most likely not work on tablets and smart phones since pixel level manipulation has not been fully implemented

### Static API methods ###

## canvasToImage(canvas, x, y, width, height) ##
Extracts a specified region of a HTMLCanvasElement and returns a new HTMLImageElement

## copy(source, target) ##
Copies the pixels from the source canvas to the target canvas

## imageDataToImage(imageData, image) ##
Writes the pixels contained in an ImageData object to an HTMLImageElement

## videoToImage(video, x, y, width, height) ##
Extracts the current frame of a video and returns a new HTMLImageElement (operation will fail if video is tainted with cross domain data)

## videoToCanvas(video, ctx) ##
Copies the pixels from the current frame of a HTML5VideoElement onto a HTML5CanvasElement

## putImage(canvas, image, x, y, width, height) ##
Paints a HTML5ImageElement onto a HTML5CanvasElement

## getBase64(canvas, x, y, width, height) ##
Extracts a specified region of a HTMLCanvasElement and returns a base64 encoded string

## base64toImage(base64, image) ##
Converts a base64 encoded string and returns an HTMLImageElement

## crop(canvas, x, y, width, height) ##
Returns a cloned canvas cropped to specified dimensions

## cropImageData(imageData, x, y, width, height) ##
Crops an ImageData object

## getImageData(canvas, x, y, width, height) ##
Returns the imageData from a HTMLCanvasElement as per specified by the supplied clip rect

## getImageData2(src) ##
Returns the imageData from a supported source (does not support clipping)

## getCanvas(width, height) ##
Returns a new HTMLCanvasElement

## clone (canvas) ##
Clones a HTMLCanvasElement and returns a new HTMLCanvasElement with same properties

## isSupported() ##
Checks for overall canvas and getImageData support. Test will fail if canvas is tainted by cross-domain data

### Usage examples ###

```html
// Extracts a 100x100 region from a Canvas element and returns an Image element
var myImage = canvasbuddy.canvasToImage(canvas, 0, 0, 100, 100);
```

```html
// Copies the pixels from the current frame of na HTML5VideoElement onto a HTML5CanvasElement
canvasbuddy.videoToCanvas(video, ctx);
```

```html
// Extracts a 100x100 region from a Canvas and returns an ImageData object
canvasbuddy.getImageData(canvas, 0, 0, 100, 100);
```