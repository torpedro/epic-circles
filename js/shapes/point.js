


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


	invertAtCircle: function(circle) {
		return geom.invertPoint(this, circle);
	}
});

