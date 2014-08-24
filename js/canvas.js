
var Canvas = xbase.Class.extend({

	/**
	 * Adds the shape to the canvas. These shapes will be inverted.
	 * @param Shape shape
	 */
	addShape: function(shape) {
		var self = this;
		this._shapes.push(shape);
		shape.showOn(this._gNormalShapes);
		shape.setType('normal');
		shape.on("move", function() {
			self._changed = true;
		});
		this._changed = true;
	},

	/**
	 * Adds the circle as an inversion circle.
	 * All shapes will be inverted at this circle.
	 * @param Circle circle
	 */
	addInversionCircle: function(circle) {
		var self = this;
		this._inversionCircles.push(circle);
		this._invertedShapes.push([]);
		circle.showOn(this._gInversionCircles);
		circle.setType('inversion');
		circle.on("move", function() {
			self._changed = true;
		});
		this._changed = true;
	},

	/**
	 * Shows or hides all original shapes.
	 * @param bool bShowOriginalShapes
	 */
	setShowOriginalShapes: function(bShowOriginalShapes) {
		var visibility = (bShowOriginalShapes) ? 'visible' : 'hidden';
		this._gNormalShapes.style('visibility', visibility);
	},

	/**
	 * Shows or hides all inverted shapes.
	 * @param bool bShowInvertedShapes
	 */
	setShowInvertedShapes: function(bShowInvertedShapes) {
		var visibility = (bShowInvertedShapes) ? 'visible' : 'hidden';
		this._gInvertedShapes.style('visibility', visibility);
		this.changed = true;
	},

	/**
	 * Shows or hides all inversion circles.
	 * @param bool bShowInversionCircles
	 */
	setShowInversionCircles: function(bShowInversionCircles) {
		var visibility = (bShowInversionCircles) ? 'visible' : 'hidden';
		this._gInversionCircles.style('visibility', visibility);
		this.changed = true;
	},


	convertInvertedShapes: function() {
		var newShapes = [];
		var newInvertedShapes = [];
		$.each(this._invertedShapes, function(i, invertedShapes) {
			newShapes = newShapes.concat(invertedShapes);
			newInvertedShapes.push([]);
		});

		this.clear();

		this._invertedShapes = newInvertedShapes;
		for (var i = 0; i < newShapes.length; ++i) {
			this.addShape(newShapes[i]);
		}
		this._update();
	},

	/**
	 * Converts position on screen into position in the canvas.
	 * Useful for mapping the mouse position to canvas coordinates.
	 * @param num x
	 * @param num y
	 */
	convertScreen: function(x, y) {
		x -= this._transformX;
		y -= this._transformY;
		x /= this._scale;
		y /= this._scale;
		return {
			"x": x,
			"y": y
		};
	},


	clear: function() {
		for (var i = 0; i < this._shapes.length; ++i) {
			this._shapes[i].remove();
			for (var j = 0; j < this._invertedShapes.length; ++j) {
				if (this._invertedShapes[j][i]) this._invertedShapes[j][i].remove();
			}
		}
		this._shapes = [];
		this._invertedShapes = [];
		return this;
	},


	init: function() {
		var self = this;
		this._scale = 1.0;
		this._transformX = $(window).width() / 2;
		this._transformY = $(window).height() / 2 - 50;

		// Initialize canvas
		this._initializeCanvas();

		this._shapes = [];
		this._inversionCircles = [];
		// Array of arrays of shapes
		this._invertedShapes = [];

		// Initialize update loop
		var fps = 60;
		window.setInterval(function() {
			self._update();
		}, 1000.0/fps);

		this._applyTransform();
		this._drawGrid();
	},


	_initializeCanvas: function() {
		// Initialize canvas
		this._canvas = document.querySelector('.canvas');

		this._svg = d3.select(this._canvas).append('svg')
			.attr('width', '100%')
			.attr('height', '100%');

		this._background = this._svg.append('rect')
			.attr('width', '100%')
			.attr('height', '100%')
			.classed('background', true);

		this._g = this._svg.append('g').classed('plane', true);
		this._g.canvas = this;

		this._gNormalShapes = this._g.append('g').classed('normalShapes', true);
		this._gNormalShapes.canvas = this;

		this._gInvertedShapes = this._g.append('g').classed('invertedShapes', true);
		this._gInvertedShapes.canvas = this;

		this._gInversionCircles = this._g.append('g').classed('inversionCircles', true);
		this._gInversionCircles.canvas = this;


		// Attach Event listeners for scaling and translating
		var self = this;
		this._canvas.addEventListener("mousewheel", function(evt) {
			var x = evt.clientX,
				y = evt.clientY;
			if (evt.deltaY > 0) {
				self._increaseScaleByPerc(-0.1, x, y);
			} else if (evt.deltaY < 0) {
				self._increaseScaleByPerc(0.1, x, y);
			}
		});

		var move = function(evt) {
			self._increaseTransform(evt.clientX - self._lastGrab.x, evt.clientY - self._lastGrab.y);
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
	},


	_increaseScaleByPerc: function(deltaPerc, x, y) {
		var newScale = Math.round(100 * this._scale * (1.0 + deltaPerc)) / 100;
		var s = newScale/this._scale;
		this._scale = newScale;
		// Scaling increases the distance between the targeted point
		// and the origin. We can calculate the new origin like this:
		// y' - Ty' = s * (y - Ty)
		// y' = y
		// => Ty' = s * Ty - (s - 1) * y
		this._transformX = s * this._transformX - (s - 1) * x;
		this._transformY = s * this._transformY - (s - 1) * y;

		this._applyTransform();
	},


	_increaseTransform: function(deltaX, deltaY) {
		this._transformX += deltaX;
		this._transformY += deltaY;
		this._applyTransform();
	},


	_applyTransform: function() {
		var translate = 'translate(' + this._transformX + 'px, ' + this._transformY + 'px)';
		var scale = 'scale(' + this._scale + ')';
		var transform = translate + ' ' + scale;

		this._g.style('transform', transform);

		this._g.selectAll('circle').style('stroke-width', 1/this._scale + 'px');
		this._g.selectAll('line').style('stroke-width', 1/this._scale + 'px');
		this._g.selectAll('polygon').style('stroke-width', 1/this._scale + 'px');
	},


	_drawGrid: function() {
		var grid = this._g.append("g").classed("grid", true);
		var min = this.convertScreen(0, 0);
		var max = this.convertScreen($(this._canvas).width(), $(this._canvas).height());

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


	_addInvertedShape: function(shape, pos, outShapes) {
		if (isFinite(pos)) {
			if (outShapes[pos]) {
				outShapes[pos].remove();
			}
			outShapes[pos] = shape
		} else {
			outShapes.push(shape);
		}
		if (shape) {
			shape.setType('inverted');
			shape.showOn(this._gInvertedShapes);
		}
	},


	_update: function() {
		if (!this._changed) return;
		this._changed = false;

		var self = this;
		$.each(this._inversionCircles, function(i, invCircle) {
			self._invertAllShapes(invCircle, self._shapes, self._invertedShapes[i]);
		});

		this._applyTransform();
	},


	/**
	 * Inverts the given inShapes at the invCircle and stores them in outShapes
	 * @param Circle invCircle
	 * @param Array<Shape> inShapes
	 * @param Array<Shape> outShapes
	 */
	_invertAllShapes: function(invCircle, inShapes, outShapes) {
		var numShapes = inShapes.length;

		for (var i = outShapes.length; i < numShapes; ++i) {
			this._addInvertedShape(null, null, outShapes);
		}

		for (var i = 0; i < numShapes; ++i) {
			var shape = inShapes[i];
			var invShape = outShapes[i];
			var newInvShape = shape.invertAtCircle(invCircle);

			if (invShape) {
				var res = invShape.copy(newInvShape);
				if (res === false) {
					// copy didn't work, because the type of shape has changed
					// so we need to overwrite the shape
					this._addInvertedShape(newInvShape, i, outShapes);
				}
			} else if (newInvShape) {
				this._addInvertedShape(newInvShape, i, outShapes);
			}
		}
	}
});
