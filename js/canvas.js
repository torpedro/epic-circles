
var Canvas = xbase.Class.extend({

	init: function() {
		var self = this;
		this.scale = 1.0;
		this.transformX = $(window).width() / 2;
		this.transformY = $(window).height() / 2 - 50;

		// Initialize canvas
		this._canvas = document.querySelector('.canvas');
		this._svg = d3.select(this._canvas).append('svg')
			.attr('width', '100%')
			.attr('height', '100%');

		this._background = this._svg.append('rect')
			.attr('width', '100%')
			.attr('height', '100%')
			.classed('background', true);

		this._g = this._svg.append('g');
		this._g.convertScreen = function() { 
			return self.convertScreen.apply(self, arguments);
		}


		// Add Event listeners for scaling and translating
		this._canvas.addEventListener("mousewheel", function(evt) {
			var x = evt.clientX,
				y = evt.clientY;
			if (evt.deltaY > 0) {
				self.increaseScaleByPerc(-0.1, x, y);
			} else if (evt.deltaY < 0) {
				self.increaseScaleByPerc(0.1, x, y);
			}
		});

		var move = function(evt) {
			self.increaseTransform(evt.clientX - self._lastGrab.x, evt.clientY - self._lastGrab.y);
			self._lastGrab = {x: evt.clientX, y: evt.clientY};
		};
		this._background[0][0].addEventListener("mousedown", function(evt) {
			self._lastGrab = {x: evt.clientX, y: evt.clientY};
			self._svg.classed("grabbed", true);
			window.addEventListener('mousemove', move, true);
		}, false);
		window.addEventListener("mouseup", function() {
			self._svg.classed("grabbed", false);
			window.removeEventListener('mousemove', move, true);
		}, false);


		// Initialize update loop

		this._shapes = [];
		this._invertedShapes = [];

		var fps = 60;
		window.setInterval(function() {
			self.update();
		}, 1000.0/fps);

		this._applyTransform();
		this._drawGrid();
	},


	increaseScaleByPerc: function(deltaPerc, x, y) {
		var newScale = Math.round(100 * this.scale * (1.0 + deltaPerc)) / 100;
		var s = newScale/this.scale;
		this.scale = newScale;
		// Scaling increases the distance between the targeted point
		// and the origin. We can calculate the new origin like this:
		// y' - Ty' = s * (y - Ty)
		// y' = y
		// => Ty' = s * Ty - (s - 1) * y
		this.transformX = s * this.transformX - (s - 1) * x;
		this.transformY = s * this.transformY - (s - 1) * y;

		this._applyTransform();
	},


	increaseTransform: function(deltaX, deltaY) {
		this.transformX += deltaX;
		this.transformY += deltaY;
		this._applyTransform();
	},


	_applyTransform: function() {
		var translate = 'translate(' + this.transformX + 'px, ' + this.transformY + 'px)';
		var scale = 'scale(' + this.scale + ')';
		var transform = translate + ' ' + scale;

		this._g.style('transform', transform);

		this._g.selectAll('circle').style('stroke-width', 1/this.scale + 'px');
		this._g.selectAll('line').style('stroke-width', 1/this.scale + 'px');
		this._g.selectAll('polygon').style('stroke-width', 1/this.scale + 'px');
	},


	_drawGrid: function() {
		var grid = this._g.append("g").classed("grid", true);
		grid.append("line")
			.attr("x1", "-25000")
			.attr("y1", "0")
			.attr("x2", "25000")
			.attr("y2", "0");
		grid.append("line")
			.attr("x1", "0")
			.attr("y1", "-25000")
			.attr("x2", "0")
			.attr("y2", "25000");
	},


	convertScreen: function(x, y) {
		x -= this.transformX;
		y -= this.transformY;
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
			if (this._invertedShapes[pos]) {
				this._invertedShapes[pos].remove();
			}
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
		var numShapes = this._shapes.length;

		for (var i = this._invertedShapes.length; i < numShapes; ++i) {
			this._addInvertedShape(null);
		}

		for (var i = 0; i < numShapes; ++i) {
			var shape = this._shapes[i];
			var invShape = this._invertedShapes[i];
			var newInvShape = shape.invertAtCircle(this._invCircle);

			if (invShape) {
				var res = invShape.copy(newInvShape);
				if (res === false) {
					// copy didn't work, because the type of shape has changed
					// so we need to overwrite the shape
					this._addInvertedShape(newInvShape, i);
				}
			} else if (newInvShape) {
				this._addInvertedShape(newInvShape, i);
			}
		}
		this._applyTransform();
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
