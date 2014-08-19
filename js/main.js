

var Canvas = xbase.Class.extend({

	init: function() {
		this._canvas = document.querySelector('.canvas');
		this._paper = Raphael(this._canvas, '100%', '100%');

		this._shapes = [];
		this._invertedShapes = [];
	},


	setInversionCircle: function(circle) {
		var self = this;
		this._invCircle = circle;
		circle.drawOn(this._paper);
		circle.setType('inversion');
		circle.on('moved', function() {
			self.update();
		});
	},


	update: function() {
		var self = this;
		$.each(this._invertedShapes, function(i, shape) {
			shape.remove();
		});
		this._invertedShapes = [];

		$.each(this._shapes, function(i, shape) {
			var invShape = self._invCircle.invertShape(shape);
			invShape.drawOn(self._paper);
			self._invertedShapes.push(invShape);
		});
	},


	addShape: function(shape) {
		var self = this;
		this._shapes.push(shape);
		shape.drawOn(this._paper);
		shape.on('moved', function() {
			self.update();
		});
	},

	width: function() {
		return $(this._canvas).width();
	}
});


$(function() {
	var canvas = new Canvas();

	var invCircle = new Circle(canvas.width()/2, 250, 80);
	canvas.setInversionCircle(invCircle);

	var circle = new Circle(canvas.width()/2 + 100, 350, 100);
	canvas.addShape(circle);
});