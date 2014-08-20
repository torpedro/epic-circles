
var Canvas = xbase.Class.extend({

	init: function() {
		var self = this;
		this._canvas = document.querySelector('.canvas');

		this._svg = d3.select(this._canvas).append('svg')
			.attr('width', '100%')
			.attr('height', '100%');

		this._g = this._svg.append('g')
			.style('transform', 'translate(50vw, 45vh)');
		this._origin = d3adapter.circle(this._g, 0, 0, 0).style('visibility', 'hidden');
		this._g.convertScreen = function() { 
			return self.convertScreen.apply(self, arguments);
		}

		this._shapes = [];
		this._invertedShapes = [];

		var fps = 60;
		window.setInterval(function() {
			self.update();
		}, 1000.0/fps);
	},


	convertScreen: function(x, y) {
		x -= this._origin[0][0].getBoundingClientRect().left;
		y -= this._origin[0][0].getBoundingClientRect().top;
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
					invShape.copy(newInvShape);
				}
			} else {
				self._invertedShapes.push(newInvShape);
				if (newInvShape) {
					newInvShape.setType('inverted');
					newInvShape.showOn(self._g);
				}
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
	}
});
