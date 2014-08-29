
/**
 * @class Line
 * x = origin + t * vector
 */
var Line = TransformableShape.extend({
	// @overridden
	init: function(x, y, dx, dy) {
		this._super();
		this._origin = new Point(x, y);
		this._vector = gVector(dx, dy).normalized();
		this._shapeKind = 'line';
	},

	// @overridden
	copy: function(otherLine) {
		if (!(otherLine instanceof Line)) return false;
		console.warn('TODO: Implement copy');
	},

	// @overridden
	render: function(svg) {
		this._parent = svg;
		this._svg = svg.append('g');

		var line = this._svg.append('line')
			.attr('x1', this._origin.x - this._vector.x()*6000)
			.attr('y1', this._origin.y - this._vector.y()*6000)
			.attr('x2', this._origin.x + this._vector.x()*6000)
			.attr('y2', this._origin.y + this._vector.y()*6000);

		var origin = this._svg.append('circle')
			.attr("cx", this._origin.x)
			.attr("cy", this._origin.y)
			.attr("r", 5)
			.classed("origin", "true");

		var rotator = this._svg.append('circle')
			.attr("cx", this._origin.x + this._vector.x()*25)
			.attr("cy", this._origin.y + this._vector.y()*25)
			.attr("r", 5)
			.classed("rotator", "true");

		this._setMoveHandle(origin);
		this._setResizeHandle(rotator);
		this._applyClasses();

		return this;
	},

	// @overridden
	onMove: function(x, y) { return this.setPosition(x, y); },

	// @overridden
	onResize: function(x, y) {
		var dx = x - this._origin.x;
		var dy = y - this._origin.y;
		this._vector = new geom.Vector(dx, dy).normalized();
		this.remove();
		this.render(this._parent);
		this.trigger('update');
	},


	setPosition: function(x, y) {
		this._origin.x = x;
		this._origin.y = y;
		this.remove();
		this.render(this._parent);
		this.trigger('update');
	},

	// @overridden
	invertAtCircle: function(invCircle) {
		// Calculate the closest point of the line to the inversion circle
		// This point and the origin of the invCircle are across from each other
		// By knowing this we can calculate the origin and radius.

		// Calculate the closest point of the line:
		// Line => x = a + tn
		// n is unit vector of line
		// a is a point on the line
		var a = gVector(this._origin.x, this._origin.y);
		var n = this._vector;

		// p is the point of which we want to know the distance
		var p = gVector(invCircle.x, invCircle.y);


		// Calculate the difference vector from the point to the line
		// See: http://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line#Vector_formulation
		var diff = a.sub(p).sub(n.mul(a.sub(p).dot(n)));

		if (diff.length() == 0) {
			// The line is going through the circles origin
			// TODO: Inversion is the line itself
			return null;
		}
		// Calculate the closest point
		// And invert it
		var p2 = p.add(diff);
		var p2i = geom.invertVector(p2, invCircle);

		// Now we construct the circle out of p2i and the origin of the inversion circle
		var cx = invCircle.x + ((p2i.x() - invCircle.x) / 2);
		var cy = invCircle.y + ((p2i.y() - invCircle.y) / 2);
		var r = $V([p2i.x() - invCircle.x, p2i.y() - invCircle.y]).distanceFrom($V([0, 0])) / 2;

		return new Circle(cx, cy, r);
	},

});
