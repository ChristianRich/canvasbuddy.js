/**
* (c) Christian Schlosrich
* Utility functions to simplify complex Canvas operations like copying pixel data across canvas, video, image and ImageData objects.
* Please note that these methods:
* 
* 1) Are CPU intensive and should not be called on every frame (like in a render / update loop)
* 2) Will not work if any sources is tainted with cross domain data (an exception is thrown)
* 3) Will most likely not work on tablets and smart phones since pixel level manipulation has not been fully implemented
*  
*/
var canvasbuddy = {

	/**
	* Extracts a specified region of a HTMLCanvasElement and returns a new HTMLImageElement
	* @param  {HTMLCanvasElement} canvas The canvas from where the image should be extracted				 
	* @param  {number=} x 
	* @param  {number=} y
	* @param  {number=} width
	* @param  {number=} height
	* @return {HTMLImageElement} The resulting image element       
	*/
	canvasToImage : function(canvas, x, y, width, height){

		if(!canvas){
			throw new TypeError('Not enough arguments');
		}

		var image = new Image();
		image.src = canvasbuddy.getBase64(canvas, x, y, width, height);
		return image;
	},

	/**
	* Copies the pixels from the source canvas to the target canvas
	* @param  {HTMLCanvasElement} source
	* @param  {HTMLCanvasElement} target
	* @return {void}
	*/
	copy : function(source, target){

		if(!source || !target){
			throw new TypeError('Not enough arguments');
		}

		target.getContext('2d').putImageData(canvasbuddy.getImageData(source), 0, 0);
	},

	/**
	* Writes the pixels contained in an ImageData object to an HTMLImageElement
	* @param  {ImageData} imageData 		The image data object
	* @param  {HTMLImageElement=} image 	Optional HTMLImageElement (so we can add a 'load' eventlistener to a blank image element)
	* @return {HTMLImageElement}
	*/
	imageDataToImage : function(imageData, image){

		if(!imageData){
			throw new TypeError('Not enough arguments');
		}

		var canvas = canvasbuddy.getCanvas(imageData.width, imageData.height);
		canvas.getContext('2d').putImageData(imageData, 0, 0);

		// If an image is supplied set the source data and wait for 'onload' to fire
		if(image){
			image.src = canvasbuddy.getBase64(canvas);
		} else{
			return canvasbuddy.canvasToImage(canvas);
		}

		return null;
	},

	/**
	* Extracts the current frame of a video and returns an HTMLImageElement (operation will fail if video is tainted with cross domain data)
	* @param  {HTMLVideoElement} video 	The video from where the image should be extracted
	* @param  {number=} x 				Optional
	* @param  {number=} y 				Optional
	* @param  {number=} width 			Optional
	* @param  {number=} height 			Optional
	* @return {HTMLImageElement}
	*/
	videoToImage : function(video, x, y, width, height){

		if(!video){
			throw new TypeError('Not enough arguments');
		}

		var srcRect = canvasbuddy.getRect(video),
			destRect = canvasbuddy.getRect(video, x, y, width, height),
			canvas = canvasbuddy.getCanvas(srcRect.width, srcRect.height),
			ctx = canvas.getContext('2d'),
			resultImage;

		ctx.drawImage(video, srcRect.x, srcRect.y, srcRect.width, srcRect.height);
		resultImage = canvasbuddy.canvasToImage(canvas, destRect.x, destRect.y, destRect.width, destRect.height);

		video = null;
		srcRect = null;
		destRect = null;
		canvas = null;
		ctx = null;

		return resultImage;
	},

	/**
	* Copies the pixels from the current frame of a HTML5VideoElement onto a HTML5CanvasElement
	* @param  {HTMLCanvasElement} video
	* @param  {CanvasRenderingContext2D} ctx
	* @return {void}
	*/
	videoToCanvas : function(video, ctx){

		if(!video || !ctx){
			throw new TypeError('Not enough arguments');
		}

		ctx.drawImage(video, 0, 0, video.width, video.height);
	},

	/**
	* Paints a HTML5ImageElement onto a HTML5CanvasElement
	* @param  {HTMLCanvasElement} canvas
	* @param  {HTMLImageElement} image
	* @param  {number=} x 				Optional
	* @param  {number=} y 				Optional
	* @param  {number=} width 			Optional
	* @param  {number=} height 			Optional
	* @return {void}
	*/
	putImage : function(canvas, image, x, y, width, height){

		if(!canvas || !image){
			throw new TypeError('Not enough arguments');
		}

		var rect = canvasbuddy.getRect(null, x, y, width, height);
		canvas.getContext('2d').drawImage(image, rect.x, rect.y, rect.width, rect.height);
	},

	/**
	* Extracts a specified region of a HTMLCanvasElement and returns a base64 encoded string
	* @param  {HTMLCanvasElement} canvas
	* @param  {number=} x 				Optional
	* @param  {number=} y 				Optional
	* @param  {number=} width 			Optional
	* @param  {number=} height 			Optional
	* @return {string}
	*/
	getBase64 : function(canvas, x, y, width, height){

		if(!canvas){
			throw new TypeError('Not enough arguments');
		}

		var srcRect = canvasbuddy.getRect(null, 0, 0, canvas.width, canvas.height),
			destRect = canvasbuddy.getRect(canvas, x, y, width, height);

		if(!srcRect.equals(destRect)){
			canvas = canvasbuddy.crop(canvas, x, y, width, height);
		}

		var imageData = canvasbuddy.getImageData(canvas, x || 0, y || 0, width, height),
			ctx = canvas.getContext('2d'),
			res;

		ctx.putImageData(imageData, x || 0, y || 0);
		res = canvas.toDataURL();

		canvas = null;
		imageData = null;
		ctx = null;

		return res;
	},

	/**
	* Converts a base64 encoded string and returns an HTMLImageElement
	* @param  {string} base64 				A base64 encoded string
	* @param  {HTMLImageElement=} image 	Optional HTMLImageElement (so we can add a 'load' eventlistener to a blank image element)
	* @return {HTMLImageElement}
	*/
	base64toImage : function(base64, image){

		if(!base64){
			throw new TypeError('Not enough arguments');
		}

		if(typeof base64 !== 'string'){
			throw new TypeError('Invalid argument');
		}

		if(image && !image instanceof HTMLImageElement){
			throw new TypeError('Invalid argument');
		}

		var i = image || new Image();
		i.src = mbase64;
		return i;
	},

	/**
	* Returns a cloned canvas cropped to specified dimensions
	* @param  {HTMLCanvasElement} canvas 	Canvas
	* @param  {number=} x 					Optional
	* @param  {number=} y  					Optional
	* @param  {number=} width 				Optional
	* @param  {number=} height 				Optional
	* @return {HTMLCanvasElement}
	*/
	crop : function(canvas, x, y, width, height){

		if(!canvas){
			throw new TypeError('Not enough arguments');
		}

		var imageData,
			clipX = parseInt(x, 10),
			clipY = parseInt(y, 10),
			clipW = width || canvas.width,
			clipH = height || canvas.height;

		if(isNaN(clipX)){
			clipX = 0;
		}

		if(isNaN(clipY)){
			clipY = 0;
		}
			
		// If clipping values are not supplied or same a supplied canvas' dimensions return a clone (no processing is required)
	 	if(clipX == 0 && clipY == 0 && clipW == canvas.width && clipH == canvas.height){
	 		return canvasbuddy.clone(canvas);
	 	}

	 	// Otherwise process the request
	 	var tmpCanvas = canvasbuddy.getCanvas(clipW, clipH),
			tmpCtx = tmpCanvas.getContext('2d');

		imageData = canvasbuddy.getImageData(canvas, clipX, clipY, clipW, clipH);
		tmpCtx.putImageData(imageData, 0, 0);

		canvas = null;
		imageData = null;
		tmpCtx = null;

		return tmpCanvas;
	},

	/**
	* Crops an ImageData object
	* @param  {ImageData} imageData
	* @param  {number} x
	* @param  {number} y
	* @param  {number} width
	* @param  {number} height
	* @return {ImageData} The cropped imageData result    
	*/
	cropImageData : function(imageData, x, y, width, height){

		if(!imageData){
			throw new TypeError('Not enough arguments');
		}

		var canvas = canvasbuddy.getCanvas(imageData.width, imageData.height);
		canvas.getContext('2d').putImageData(imageData, 0, 0);
		return canvasbuddy.getImageData(canvas, x, y, width, height);
	},

	/**
	* Returns the imageData from a HTMLCanvasElement as per specified by the supplied clip rect (clip rect is optional)
	* @param  {HTMLCanvasElement} canvas
	* @param  {number=} x 				Optional
	* @param  {number=} y 				Optional
	* @param  {number=} width 			Optional
	* @param  {number=} height 			Optional
	* @return {ImageData} 
	*/
	getImageData : function(canvas, x, y, width, height){

		if(!canvas){
			throw new TypeError('Not enough arguments');
		}

		if(!canvas instanceof HTMLCanvasElement){
			throw new TypeError('Invalid type ' + canvas);
		}

		var clipX = parseInt(x, 10) || 0,
			clipY = parseInt(y, 10) || 0,
			clipW = width || canvas.width,
			clipH = height || canvas.height;

		return canvas.getContext('2d').getImageData(clipX, clipY, clipW, clipH);
	},

	/** 
	* Returns the imageData from a supported source (but does not support clipping)
	* @param  {HTMLCanvasElement|CanvasRenderingContext2D|HTMLVideoElement|HTMLImageElement} src
	* @return {ImageData}
	*/
	getImageData2 : function(src){
		
		if(!src){
			throw new TypeError('Not enough arguments');
		}

		var canvas,
			ctx,
			imageData;

		if(src instanceof HTMLCanvasElement){
			ctx = src.getContext('2d');
			imageData = ctx.getImageData(0, 0, src.width, src.height);
		} else if(src instanceof CanvasRenderingContext2D){
			imageData = src.getImageData(0, 0, src.canvas.width, src.canvas.height);
		} else if(src instanceof HTMLImageElement || src instanceof HTMLVideoElement){
			canvas = canvasbuddy.getCanvas(src.width, src.height);
			ctx = canvas.getContext('2d');
			ctx.drawImage(src, 0, 0);
			imageData = ctx.getImageData(0, 0, src.width, src.height);
		} else {
			throw new TypeError('Invalid arguments');
		}

		canvas = null;
		ctx = null;

		return imageData;
	},

	/**
	* Returns a new HTMLCanvasElement
	* @param  {number=} width
	* @param  {number=} height
	* @return {HTMLCanvasElement} 
	*/
	getCanvas : function(width, height){
		var canvas = document.createElement('canvas');
		canvas.width = width || 300;
		canvas.height = height || 150;	
		return canvas;
	},

	/**
	* Clones a HTMLCanvasElement and returns a new HTMLCanvasElement with same properties
	* @param  {HTMLCanvasElement} canvas
	* @return {HTMLCanvasElement}
	*/
	clone : function(canvas){

		if(!canvas){
			throw new TypeError('Not enough arguments');
		}

		if(!canvas.width || !canvas.height){
			throw new TypeError('Canvas has no properties');
		}

		var tmpCanvas = canvasbuddy.getCanvas(canvas.width, canvas.height),
			tmpCtx = tmpCanvas.getContext('2d'),
			ctx = canvas.getContext('2d'),
			imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

		tmpCtx.putImageData(imageData, 0, 0);

		tmpCtx = null;
		ctx = null;
		imageData = null;

		return tmpCanvas;
	},

	/**
	* Checks for overall canvas and getImageData support. Test will fail if canvas is tainted by cross-domain data
	* @return {boolean}
	*/
	isSupported : function(){

		var canvas,
			ctx,
			imageData;
			
		try { 
			canvas = document.createElement('canvas');
			ctx = canvas.getContext('2d');
		} catch(e) { 
			return false; 
		}

		try { 
			imageData = ctx.getImageData(0, 0, 1, 1);
		} catch(e) { 
			return false; 
		}

		canvas = null;
		ctx = null;
		imageData = null;

		return true;
	},

	/**
	* Internal helper method to correctly format and compare clipping rectangles (saves repetitious code)
	* @param  {*} src 			Any object having a width and height property. If unsupplied a zero based Rectangle is returned
	* @param  {number=} x 		Optional
	* @param  {number=} y 		Optional
	* @param  {number=} width 	Optional
	* @param  {number=} height 	Optional
	* @return {Object}
	*/
	getRect : function(src, x, y, width, height){

		if(!src){
			src = {};
			src.width = 0;
			src.height = 0;
		}

		return {
			x: parseInt(x, 10) || 0,
			y: parseInt(y, 10) || 0,
			width: parseInt(width, 10) || src.width,
			height: parseInt(height, 10) || src.height,

			equals : function(rect){
				return rect.x == this.x && 
					rect.y == y &&
					rect.width == this.width && 
					rect.height == this.height;
			},

			toString : function(){
				return '[Rect] x: ' + this.x + ', y: ' + this.y + ', width: ' + this.width + ', height: ' + this.height;	
			}
		}
	}
}