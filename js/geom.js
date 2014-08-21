
if (typeof geom === "undefined") geom = {};

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
	var v = new Vector(invCircle.x - circle.x, invCircle.y - circle.y)
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
	var v_diameter = new Vector(
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