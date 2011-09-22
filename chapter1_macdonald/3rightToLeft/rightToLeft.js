/*
 * js port of examples from Flash Math Creativity 2nd ed. - wanted to see how these would go with raphael.js * 
 * Original ActionScript source (as of 11/09/2011) is available at http://www.friendsofed.com/fmc/downloads/ 
 * 
 * For readability variable & method names have been left as close as possible to the original AS2 code.
 */
(function(){	
	var MacDonaldRightToLeft = this.MacDonaldRightToLeft = function MacDonaldRightToLeft(){
				
		var frequency = 30;	// how often circles are created
		var colMin = 0.75;		// minimum brightness
		var colMax = 1;//50;		// maximum brightness
		var colVariance = colMax - colMin;// range of brightness
		var canvas;
				
		function setBrightness(col, brightness){
			var anum = 100 - brightness;
			var bnum = 255 / 100 * brightness;
			col.setTransform({ra:anum, ga:anum, ba:anum, rb:bnum, gb:bnum, bb:bnum, aa:100, ab:0});
		}	
		
		// how fast the circles move across the screen
		function leftRightSpeed() {
			return -2;
		}
		// maximum scale
		function maxScale() {
			return 120;
		}
		// minimum scale
		function minScale() {
			return 60;
		}
		// radius of the circle the ball moves around
		function leftRightRadius() {
			return 150;
		}
		// speed at which the ball moves around the circle
		function circlingSpeed() {
			return 5;
		}
		// degree at which the ball starts on the circle
		function circleStartPoint() {
			return 0;
		}
		// range of the ball's up/down motion
		function upDownRange() {
			return 10;
		}
		// speed at which the ball moves up and down
		function yFreqInc() {
			return 12;
		}
		// setting the brightness for each ball
		function nooCol(val) {
			val *= 30;
			// increase this number and the colors will oscillate more
			return colMin + colVariance * 0.5 + (0.5 * colVariance) * Math.sin(val * Math.PI / 180);
		}
		var g = 0;
		var depth = 0;
		
		this.init = function init(raphaelCanvas){
			canvas = raphaelCanvas;
		}
		
		this.onEnterFrame = function() {
			g++;
			if (g > frequency) {
				g = 0;
				depth++;//see TODO further down about depth...			
				var nooData = {
						_fulcrumX:canvas.width + 30,
						_x:canvas.width + 30,
						_y:0,
						_maxScale:maxScale(),
						_minScale:minScale(),
						_variance: maxScale() - minScale(),
						_acrossRadius:leftRightRadius(),
						_upDownRange:upDownRange(),
						_degree:circleStartPoint(),
						_degreeInc:circlingSpeed(),
						_yFreq:0,
						_yFreqInc:yFreqInc(),
						_leftRightSpeed:leftRightSpeed()					
				};
				
				var noo = canvas.circle(nooData._x, nooData._y, 21);
				//TODO colouring works, just looks a bit rubbish at the moment without the depth management working.
				//var brightness = nooCol(depth);						
				//noo.attr({fill:"hsb(0, 1, " + brightness + ")", stroke:"none"});			
				noo.attr({fill:"#FF0000", stroke:"none"});	
				
				var spriteFrameHandler = function(){
					sprite.data._fulcrumX += sprite.data._leftRightSpeed;
					sprite.data._degree += sprite.data._degreeInc;	
					
					var newScale = (sprite.data._minScale+(sprite.data._variance * 0.5) + (sprite.data._variance * 0.5) * Math.sin(sprite.data._degree * Math.PI / 180)) / 100;
					sprite.data._yFreq += sprite.data._yFreqInc;
					sprite.data._x = sprite.data._fulcrumX+Math.cos(sprite.data._degree * Math.PI / 180) * sprite.data._acrossRadius; 
					sprite.data._y = canvas.height / 2 + sprite.data._upDownRange * Math.sin(sprite.data._yFreq * Math.PI / 180);						
					
					//TODO this.swapDepths(Math.floor(this._xscale));								
					
					if (sprite.data._x  > -40) {
						sprite.circle.animate({ cx: sprite.data._x,
							cy: sprite.data._y,
							scale: newScale}, 
							33, 
							sprite.onEnterFrame);
					}
					else
					{									
						sprite.circle.remove();
						delete sprite;
					}			
				}			
				var sprite = {circle:noo, data:nooData, onEnterFrame:spriteFrameHandler};
				sprite.onEnterFrame();
			}
		}		
		return this;
	}
})();
