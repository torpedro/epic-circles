


$(function() {
	var canvas = document.querySelector('.canvas');
	var paper = Raphael(canvas, '100%', '100%');

	var w = $(canvas).width();
	var h = 500;


	var circle = new Circle(w/2+100, h/2+100, 100);
	circle.drawOn(paper);

	var invertedShapes = [];
	var invert = function(invCircle) {
		$.each(invertedShapes, function(i, shape) {
			shape.remove();
		});

		invertedShapes = [];
		var invertedCircle = invCircle.invertCircle(circle);
		invertedCircle.drawOn(paper);
		invertedShapes.push(invertedCircle);
	}


	var invCircle = new Circle(w/2, h/2, 80);
	invCircle.drawOn(paper);
	invCircle.setType('inversion');

	invCircle.on('moved', function() {
		invert(invCircle);
	});
	circle.on('moved', function() {
		invert(invCircle);
	});

	invert(invCircle);
});