
/**
 * @class Circle
 * Implementation of a circle shape
 */
var Circle = TransformableShape.extend({
	// @overridden
	init: function(x, y, r) {
		this._super();
		this._shapeKind = 'circle';
		this.x = x;
		this.y = y;
		this.r = r;
	},

	// @overridden
	copy: function(otherCircle) {
		if (!(otherCircle instanceof Circle)) return false;
		this.setPosition(otherCircle.x, otherCircle.y);
		this.setRadius(otherCircle.r);
		return true;
	},

	// @overridden
	render: function(svg) {
		this._parent = svg;
		this._svg = svg.append("g").classed("circle", true);

		this._circle = this._svg.append("circle")
			.attr("cx", this.x)
			.attr("cy", this.y)
			.attr("r", this.r)
			.classed("circle", "true");

		this._origin = this._svg.append("circle")
			.attr("cx", this.x)
			.attr("cy", this.y)
			.attr("r", 5)
			.classed("origin", "true");

		this._applyClasses();
		this._setMoveHandle(this._origin);
		this._setResizeHandle(this._circle);

		return this;
	},

	// @overridden
	onMove: function(x, y) { return this.setPosition(x, y); },

	// @overridden
	onResize: function(x, y) {
		var r = $V([x, y]).distanceFrom($V([this.x, this.y]));
		this.setRadius(r);
	},

	setPosition: function(x, y) {
		this.x = x;
		this.y = y;
		this._circle.attr('cx', x);
		this._circle.attr('cy', y);
		this._origin.attr('cx', x);
		this._origin.attr('cy', y);
		this.trigger('update');
		return this;
	},

	setRadius: function(r) {
		// TODO: Prevent resizing if it's an inverted circle
		this.r = r;
		this._circle.attr('r', r);
		this.trigger('update');
		return this;
	},


	// @overridden
	invertAtCircle: function(invCircle) {
		// calculate closest and farthest point of circle
		// invert those and calculate center and radius
		var vn = gVector(invCircle.x - this.x, invCircle.y - this.y).normalized();

		var p1 = gVector(
			this.x + vn.x() * this.r,
			this.y + vn.y() * this.r
		);
		var p2 = gVector(
			this.x - vn.x() * this.r,
			this.y - vn.y() * this.r
		);

		// Check if the closest point is the origin
		// If that's the case then the inversion is a line
		if (p1.x() == invCircle.x && p1.y() == invCircle.y) {
			// p2 inverted is a point on the line
			var origin = geom.invertVector(p2, invCircle)

			// we also need to calculate the direction
			var diff = p1.sub(p2);
			var direction = diff.rotate(Math.PI/2);

			return new Line(origin.x, origin.y, direction.x(), direction.y());
		}

		// Invert points
		var p1i = geom.invertVector(p1, invCircle);
		var p2i = geom.invertVector(p2, invCircle);

		// Calculate origin and radius of new circle
		var v_diameter = p1i.sub(p2i);
		var r_new = v_diameter.length() / 2;
		var center = p1i.sub(v_diameter.mul(0.5));

		var newCircle = new Circle(center.x(), center.y(), r_new);
		return newCircle;
	}
});



Circle.calculatePoints = function(x, y, r, num, offset) {
	if (!offset) offset = 0;

	var step = (2*Math.PI) / num;
	var points = [];
	for (var i = 0; i < num; ++i) {
		var p = new Point(
			x + Math.sin(offset + step*i) * r,
			y + Math.cos(offset + step*i) * r
		);
		points.push(p);
	}
	return points;
}