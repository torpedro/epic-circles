
/**
 * Static Class
 */
var PresetLoader = {};


PresetLoader.hasPreset = function(preset) {
	return PresetLoader.presets.hasOwnProperty(preset);
}

PresetLoader.load = function(preset, canvas) {
	canvas.clear();
	PresetLoader.presets[preset](canvas);
}

PresetLoader.presets = {
	'Clear': function(canvas) {
		var invCircle = new Circle(0, 0, 100);
		canvas.addInversionCircle(invCircle);
	},

	'Epic-Circles': function(canvas) {
		// radius and position of big circle
		var r = 200;
		var x = 0;
		var y = 0;

		var invCircle = new Circle(x, y+r, r);
		canvas.addInversionCircle(invCircle);


		// Biggest circle
		// canvas.addShape(new Circle(x, y, r));
		// canvas.addShape(new Circle(x, y-r/2, r/2));
		// canvas.addShape(new Circle(x, y+r/2, r/2));

		canvas.addShape(new Line(x, y, 1, 0));
		canvas.addShape(new Line(x, y+r/2, 1, 0));

		// Circles within the lines
		// canvas.addShape(new Circle(x, y+r/4, r/4));
		var numCircles = 15;
		for (var i = -numCircles; i <= numCircles; ++i) {
			// Bigger circle
			canvas.addShape(new Circle(x-(i*r/2), y+r/4, r/4));
			// Smaller circle
			canvas.addShape(new Circle(x+r/4-(i*r/2), y+r/16, r/16));
		}
	},

	'Demo': function(canvas) {
		var r = 200;
		var x = 0;
		var y = 0;

		var invCircle = new Circle(x, y+363.5, r);
		canvas.addInversionCircle(invCircle);

		// var invCircle2 = new Circle(x, y-363.5, r);
		// canvas.addInversionCircle(invCircle2);

		var metaCircle = new Circle(x, y, 250);
		var points = metaCircle.calculatePoints(10);
		$.each(points, function(i, p) {
			canvas.addShape(new Circle(p.x, p.y, 19.6));
		});

		canvas.addShape(new Rectangle(-20, 180, 40, 40));
		canvas.addShape(new Rectangle(-20, 100, 40, 40));
		canvas.addShape(new Rectangle(-20, 20, 40, 40));
		canvas.addShape(new Rectangle(-20, -60, 40, 40));
		canvas.addShape(new Rectangle(-20, -140, 40, 40));
		canvas.addShape(new Rectangle(-20, -220, 40, 40));

		canvas.addShape(new Line(0, 100, 1, -1));

		canvas.addShape(new Triangle(-100, 100, 100));
	}
}