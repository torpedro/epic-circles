


$(function() {
	var canvas = document.querySelector('.canvas');
	var paper = Raphael(canvas, '100%', '100%');

	var w = $(canvas).width();
	var h = 500;


	var circle = new Circle(w/2+100, h/2+100, 100);
	var points = circle.calculatePoints(50);
	$.each(points, function(i, p) { p.drawOn(paper); });

	var invertedPoints = [];
	var invertPoints = function(invCircle, points) {
		$.each(invertedPoints, function(i, point) {
			point.remove();
		});
		invertedPoints = [];
		$.each(points, function(i, point) {
			var p = invCircle.invertPoint(point);
			p.drawOn(paper);
			invertedPoints.push(p);
		});
	}


	var invCircle = new Circle(w/2, h/2, 80);
	invCircle.drawOn(paper);
	invCircle.on('moved', function() {
		invertPoints(invCircle, points);
	});

	invertPoints(invCircle, points);
});