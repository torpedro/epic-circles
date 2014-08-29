
/**
 * @class Line
 * x = origin + t * vector
 */
var Line = TransformableShape.extend({
	// @overridden
	init: function(x, y, dx, dy) {
		this._super();
		this._origin = new Point(x, y);
		this._vector = new geom.Vector(dx, dy).normalized();
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
		this.trigger('move');
	},


	// @overridden
	invertAtCircle: function(invCircle) {
		return geom.invertLine(this, invCircle);
	},

	setPosition: function(x, y) {
		this._origin.x = x;
		this._origin.y = y;
		this.remove();
		this.render(this._parent);
		this.trigger('move');
	},

});
