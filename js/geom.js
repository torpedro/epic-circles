
if (typeof geom === "undefined") geom = {};


geom.Vector = xbase.Class.extend({
	init: function(x, y) {
		this.x = x;
		this.y = y;
	},


	length: function() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	},


	normalized: function() {
		var len = this.length();
		return new geom.Vector(this.x/len, this.y/len);
	},


	sub: function(v) {
		return new Vector(this.x - x, this.y - y);
	},

	add: function(v) {
		return new Vector(this.x + x, this.y + y);
	}
});



/**
 * Inverts a  point at the given inversion circle
 * @param Point point       point to be inverted
 * @param Circle invCircle  inversion circle
 * @return Point
 */
geom.invertPoint = function(point, invCircle) {
	// OA x OA' = r*r
	var dx = point.x - invCircle.x,
		dy = point.y - invCircle.y;

	var sign_x = (dx > 0) ? 1 : -1;
	var sign_y = (dy > 0) ? 1 : -1;

	var d = Math.sqrt(dx*dx + dy*dy);

	var d2 = (invCircle.r * invCircle.r) / d;

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

	return new Point(invCircle.x + dx2, invCircle.y + dy2);
}



/**
 * Inverts a circle at the given inversion circle
 * @param Circle circle     circle to be inverted
 * @param Circle invCircle  inversion circle
 * @return Circle or Line
 */
geom.invertCircle = function(circle, invCircle) {
	// calculate closest and farthest point of circle
	// invert those and calculate center and radius
	var v = new geom.Vector(invCircle.x - circle.x, invCircle.y - circle.y)
	var vn = v.normalized();

	var p1 = new Point(
		circle.x + vn.x * circle.r,
		circle.y + vn.y * circle.r
	);
	var p2 = new Point(
		circle.x - vn.x * circle.r,
		circle.y - vn.y * circle.r
	);

	// Invert points
	var p1i = geom.invertPoint(p1, invCircle);
	var p2i = geom.invertPoint(p2, invCircle);

	// Calculate origin and radius of new circle
	var v_diameter = new geom.Vector(
		p1i.x - p2i.x,
		p1i.y - p2i.y
	);
	var r_new = v_diameter.length() / 2;
	var cx = p1i.x - v_diameter.x/2;
	var cy = p1i.y - v_diameter.y/2;
	var newCircle = new Circle(cx, cy, r_new);
	return newCircle;
}



/**
 * Inverts a polygon at the given inversion circle
 * @param Polygon polygon   polygon to be inverted
 * @param Circle invCircle  inversion circle
 * @return Polygon
 */
geom.invertPolygon = function(polygon, invCircle) {
	var newPoints = [];
	$.each(polygon._points, function(i, pt) {
		var invPt = geom.invertPoint(pt, invCircle);
		newPoints.push(invPt);
	});
	var invertedShape = new Polygon(newPoints);
	return invertedShape;
}




/**
 * Inverts a line at the given inversion circle
 * @param Line line         line to be inverted
 * @param Circle invCircle  inversion circle
 * @return Circle
 */
geom.invertLine = function(line, invCircle) {
	// Calculate the closest point of the line to the inversion circle
	// This point and the origin of the invCircle are across from each other
	// By knowing this we can calculate the origin and radius.

	// Calculate the closest point of the line:
	// Line => x = a + tn
	// n is unit vector of line
	// a is a point on the line
	var a = $V([line._origin.x, line._origin.y]);
	var n = $V([line._vector.x, line._vector.y]);

	// p is the point of which we want to know the distance
	var p = $V([invCircle.x, invCircle.y]);


	// Calculate the difference vector from the point to the line
	// See: http://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line#Vector_formulation
	var diff = a.subtract(p).subtract(n.multiply(a.subtract(p).dot(n)));

	// Calculate the closest point
	// var p2 = p.add(diff);

	// Now we construct the circle out of diff
	var c = p.add(diff.multiply(0.5));
	var r = diff.multiply(0.5).distanceFrom($V([0, 0]));

	return new Circle(c.e(1), c.e(2), r);
}