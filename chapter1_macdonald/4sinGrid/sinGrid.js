var macdonaldSinGrid = (function(){
	
	var across = 10;								// number of circles across
	var down = 10;								// number of circles down
	var total = across*down;						// total number of circles
	var hsp = 20;								// horizontal spacing
	var vsp = 20;								// vertical spacing
	var degInc = 360 / total;					// number of degree per circle to span one complete oscillation
	var numberOfOscillations = 1;				// how much of a complete curve to display at once
	var bx;	// starting x position
	var by;	// starting y position
	var canvas
	var spriteCollection;
	
	function init(raphaelCanvas){
		canvas = raphaelCanvas;
		bx = (canvas.width - hsp * across) / 2;
		by = (canvas.height - vsp * down) / 2;
		
		//buildGrid();
	}
	
	function setBrightness(col, brightness) {
		var anum = 100-brightness;
		var bnum = 255/100*brightness;
		col.setTransform({ra:anum, ga:anum, ba:anum, rb:bnum, gb:bnum, bb:bnum, aa:100, ab:0});
	}	
	
	// how fast the wave moves across - we pass this an offset value which represents how many positions away form the centre the current circle is.
	function increment(){
		return 30;
	}
	// minimum scale
	function minScale() {
		return 0.3;
	}
	// maximum scale
	function maxScale() {
		return 0.54;
	}
	// minimum brightness
	function minBrt() {
		return 0;
	}
	// maximum brightness
	function maxBrt() {
		return 50;
	}
	var row = 0;
	var column = 0;
	spriteCollection = new Array();
	function buildGrid() {
		
		for (i=0; i<total; i++) {			
			
			var newSprite = sprite();
			newSprite.data._x = bx + column * hsp,
			newSprite.data._y =by + row * vsp,
			newSprite.data._offset = Math.abs(total / 2 - i),
			newSprite.data._myInc = increment(newSprite.data._offset),
			newSprite.data._minScale = minScale(),
			newSprite.data._maxScale = maxScale(),
			newSprite.data._variance = maxScale() - minScale(),
			newSprite.data._minBrt = minBrt(),
			newSprite.data._maxBrt = maxBrt(),
			newSprite.data._colVariance = maxBrt() - minBrt(),
			newSprite.data._degree = i * degInc * numberOfOscillations
			
			newSprite.circle = canvas.circle(newSprite.data._x, newSprite.data._y, 9);		
			newSprite.circle.attr({fill:"#FF0000", stroke:"none"});			
			
			newSprite.onEnterFrame = function(){
				newSprite.data._degree += newSprite.data._myInc;
				var sinVal = Math.sin(newSprite.data._degree * Math.PI / 180);
				var newScale = newSprite.data._minScale + (newSprite.data._variance * 0.5) + (newSprite.data._variance * 0.5) * sinVal;
				var brightness = newSprite.data._minBrt + (0.5 * newSprite.data._colVariance) + (0.5 * newSprite.data._colVariance) * sinVal;
				//setBrightness(sprite.data.col, brightness);			
				newSprite.circle.animate({scale: newScale}, 33, newSprite.data.onEnterFrame);
			}		
			
			newSprite.onEnterFrame();
			spriteCollection[i] = newSprite;
			column++;
			if (column == across) {
				column = 0;
				row++;
			}
		}
		
	}
	
	function sprite(){
		var nooData = {
				_x:0,
				_y:0,
				_offset:0,
				_myInc:0,
				_minScale:0,
				_maxScale:0,
				_variance:0,
				_minBrt:0,
				_maxBrt:0,
				_colVariance:0,
				_degree:0
			}
			
		var noo;
		var frameHandler; 
		return {circle:noo, data:nooData, onEnterFrame:frameHandler};
	}
	
	var onEnterFrame = function(){
		for (i=0; i<spriteCollection.length; i++) {
			spriteCollection[i].onEnterFrame();
		}
	}
	
	return {init: init, onEnterFrame:onEnterFrame};
})();

