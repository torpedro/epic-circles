
var Canvas = xbase.Class.extend({

	init: function() {
		var self = this;
		this.scale = 1.0;
		this.transformX = "50vw";
		this.transformY = "45vh";
		this._canvas = document.querySelector('.canvas');

		this._svg = d3.select(this._canvas).append('svg')
			.attr('width', '100%')
			.attr('height', '100%');

		this._g = this._svg.append('g');

		this._origin = d3adapter.circle(this._g, 0, 0, 0).style('visibility', 'hidden');
		this._g.convertScreen = function() { 
			return self.convertScreen.apply(self, arguments);
		}


		this._canvas.addEventListener("mousewheel", function(evt) {
			if (evt.deltaY > 0) {
				self.increaseScaleByPerc(-0.1);
			} else if (evt.deltaY < 0) {
				self.increaseScaleByPerc(0.1);
			}
		});

		this._shapes = [];
		this._invertedShapes = [];

		var fps = 60;
		window.setInterval(function() {
			self.update();
		}, 1000.0/fps);

		this._applyTransform();
	},


	increaseScaleByPerc: function(deltaPerc) {
		this.scale = Math.round(100 * this.scale * (1.0 + deltaPerc)) / 100;
		console.log(this.scale);
		this._applyTransform();
	},


	_applyTransform: function() {
		var transform = 'translate(' + this.transformX + ', ' + this.transformY + ') scale(' + this.scale + ')';
		this._g.style('transform', transform);
	},


	convertScreen: function(x, y) {
		x -= this._origin[0][0].getBoundingClientRect().left;
		y -= this._origin[0][0].getBoundingClientRect().top;
		x /= this.scale;
		y /= this.scale;
		return {
			"x": x,
			"y": y
		};
	},


	setInversionCircle: function(circle) {
		var self = this;
		this._invCircle = circle;
		circle.showOn(this._g);
		circle.setType('inversion');
		circle.on("move", function() {
			self._changed = true;
		});
		this._changed = true;
	},

	_addInvertedShape: function(shape, pos) {
		if (isFinite(pos)) {
			this._invertedShapes[pos]._remove();
			this._invertedShapes[pos] = shape
		} else {
			this._invertedShapes.push(shape);
		}
		if (shape) {
			shape.setType('inverted');
			shape.showOn(this._g);
		}
	},

	update: function() {
		if (!this._changed) return;
		this._changed = false;
		
		var self = this;
		$.each(this._shapes, function(i, shape) {
			var newInvShape = null;
			// Check if we are supposed to invert the shape
			if (shape.doInvert) newInvShape = self._invCircle.invertShape(shape);

			if (i < self._invertedShapes.length) {
				var invShape = self._invertedShapes[i];
				if (invShape) {
					var res = invShape.copy(newInvShape);
					if (res === false) {
						// copy didn't work, because the type of shape has changed
						console.log("Shape changed", newInvShape)
						self._addInvertedShape(newInvShape, i);
					}
				}
			} else {
				self._addInvertedShape(newInvShape);
			}
		});
	},


	addShape: function(shape) {
		var self = this;
		this._shapes.push(shape);
		shape.showOn(this._g);
		shape.on("move", function() {
			self._changed = true;
		});
		this._changed = true;
	},


	width: function() {
		return $(this._canvas).width();
	},


	setShowOriginalShapes: function(showOriginalShapes) {
		if (!showOriginalShapes) {
			for (var n = 0; n < this._shapes.length; ++n) {
				this._shapes[n].hide();
			}
		} else {
			for (var n = 0; n < this._shapes.length; ++n) {
				this._shapes[n].showOn(this._g);
			}
		}
	},

	setShowInvertedShapes: function(showInvertedShapes) {
		if (!showInvertedShapes) {
			for (var n = 0; n < this._invertedShapes.length; ++n) {
				this._invertedShapes[n].hide();
			}
		} else {
			for (var n = 0; n < this._invertedShapes.length; ++n) {
				this._invertedShapes[n].showOn(this._g);
			}
			this.changed = true;
		}
	}


});
