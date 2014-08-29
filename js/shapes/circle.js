
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
		var self = this;

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
	invertAtCircle: function(invCircle) {
		return geom.invertCircle(this, invCircle);
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
		this.trigger('move');
		return this;
	},

	setRadius: function(r) {
		// TODO: Prevent resizing if it's an inverted circle
		this.r = r;
		this._circle.attr('r', r);
		this.trigger('move');
		return this;
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