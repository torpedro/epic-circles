


var Point = Shape.extend({
	// TODO: add label
	init: function(x, y) {
		this._super();
		this.x = x;
		this.y = y;
	},


	_showOn: function(svg) {
		this._svg = svg.append("circle")
			.attr("cx", this.x)
			.attr("cy", this.y)
			.attr("r", 3);
		return this;
	},


	_hide: function() {
		this._svg.remove();
	},


	copy: function(otherPoint) {
		this.x = x;
		this.y = y;
		// TODO: update position of this._svg;
	},


	/**
	 * Inverts this point at the given circle
	 */
	invertAtCircle: function(circle) {
		var v1 = new geom.Vector(this.x, this.y);
		var v2 = geom.invertVector(v1, circle);
		return new Point(v2.x(), v2.y());
	}
});

