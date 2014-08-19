

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
		this.update();
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
		this.update();
	},

	width: function() {
		return $(this._canvas).width();
	}
});


$(function() {
	var canvas = new Canvas();
	var x = canvas.width()/2;
	var y = 500;

	var invCircle = new Circle(x, y, 200);
	canvas.setInversionCircle(invCircle);

	var metaCircle = new Circle(x, y, 250);
	var points = metaCircle.calculatePoints(40);
	$.each(points, function(i, p) {
		canvas.addShape(new Circle(p.x, p.y, 19.6));
	});
	// canvas.addShape(new Circle(x + 100, y + 100, 100));
	// canvas.addShape(new Circle(x - 100, y + 100, 100));
	// canvas.addShape(new Circle(x + 100, y - 100, 100));
	// canvas.addShape(new Circle(x - 100, y - 100, 100));

});