


$(function() {
	// Creates canvas 320 × 200 at 10, 50
	var canvas = document.querySelector('.canvas');
	var w = 800,
		h = 600;

	$(canvas).width(w);
	$(canvas).height(h);
	var paper = Raphael(canvas, w, h);


	var points = [];
	points.push(new Point(350, 250).drawOn(paper));
	points.push(new Point(450, 250).drawOn(paper));
	points.push(new Point(350, 350).drawOn(paper));
	points.push(new Point(450, 350).drawOn(paper));
	points.push(new Point(400, 350).drawOn(paper));
	points.push(new Point(400, 250).drawOn(paper));
	points.push(new Point(450, 300).drawOn(paper));
	points.push(new Point(350, 300).drawOn(paper));

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


	var invCircle = new InversionCircle(400, 300, 100);
	invCircle.drawOn(paper);
	invCircle.on('moved', function() {
		invertPoints(invCircle, points);
	});

	invertPoints(invCircle, points);
});