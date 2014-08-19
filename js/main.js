

var Point = xbase.Class.extend({
	init: function(x, y) {
		this.x = x;
		this.y = y;
	},

	drawOn: function(paper) {
		var o = paper.circle(this.x, this.y, 1);
		return this;
	}
})



var InversionCircle = xbase.Class.extend({
	init: function(x, y, r) {
		this.x = x;
		this.y = y;
		this.r = r;
	},

	drawOn: function(paper) {
		var c = paper.circle(this.x, this.y, this.r);
		var o = paper.circle(this.x, this.y, 1);
		c.node.setAttribute("class", "inversion-circle");
		o.node.setAttribute("class", "inversion-origin");
		return this;
	},

	inversePoint: function(p) {
		// OA x OA' = r*r
		var dx = p.x - this.x,
			dy = p.y - this.y;

		var sign_x = (dx > 0) ? 1 : -1;
		var sign_y = (dy > 0) ? 1 : -1;

		var d = Math.sqrt(dx*dx + dy*dy);

		var d2 = (this.r * this.r) / d;

		if (dx == 0) {
			var dx2 = 0;
			var dy2 = d2;
		} else {
			var ratio = Math.abs(dy / dx);
			var dx2 = d2 / Math.sqrt(1 + ratio*ratio);
			var dy2 = dx2 * ratio;
		}

		dx2 *= sign_x;
		dy2 *= sign_y;

		return new Point(this.x + dx2, this.y + dy2);
	}
});



$(function() {
	// Creates canvas 320 × 200 at 10, 50
	var canvas = document.querySelector('.canvas');
	var w = 800,
		h = 600;

	$(canvas).width(w);
	$(canvas).height(h);
	var paper = Raphael(canvas, w, h);

	var invCircle = new InversionCircle(400, 300, 100);
	invCircle.drawOn(paper);

	var p1 = new Point(350, 250).drawOn(paper);
	invCircle.inversePoint(p1).drawOn(paper);

	var p2 = new Point(450, 250).drawOn(paper);
	invCircle.inversePoint(p2).drawOn(paper);

	var p3 = new Point(350, 350).drawOn(paper);
	invCircle.inversePoint(p3).drawOn(paper);

	var p4 = new Point(450, 350).drawOn(paper);
	invCircle.inversePoint(p4).drawOn(paper);


	var p5 = new Point(400, 350).drawOn(paper);
	invCircle.inversePoint(p5).drawOn(paper);

	var p6 = new Point(400, 250).drawOn(paper);
	invCircle.inversePoint(p6).drawOn(paper);

	var p7 = new Point(450, 300).drawOn(paper);
	invCircle.inversePoint(p7).drawOn(paper);

	var p8 = new Point(350, 300).drawOn(paper);
	invCircle.inversePoint(p8).drawOn(paper);


});