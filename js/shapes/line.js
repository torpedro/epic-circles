
var Line = Shape.extend({
	// Line => x = origin + t * vector

	init: function(x, y, dx, dy) {
		this._super();
		this._origin = new Point(x, y);
		this._vector = new geom.Vector(dx, dy).normalized();
		this._type = 'normal';
	},

	copy: function(otherLine) {
		if (!(otherLine instanceof Line)) return false;
		console.warn("TODO: Implement copy");
	},

	remove: function() {
		this._svg.remove();
	},

	_showOn: function(svg) {
		if (this._svg) {
			this._svg.style('visibility', '');
			return this;
		}

		this._svg = svg.append("line")
			.attr("x1", this._origin.x - this._vector.x*1000)
			.attr("y1", this._origin.y - this._vector.y*1000)
			.attr("x2", this._origin.x + this._vector.x*1000)
			.attr("y2", this._origin.y + this._vector.y*1000);
		this._applyClasses();
		return this;
	},

	_hide: function() {
		this._svg.style('visibility', 'hidden');
	},


	setType: function(type) {
		this._type = type;
		this._applyClasses();
	},

	_applyClasses: function() {
		if (this._svg) {
			this._svg.attr("class", this._type);
		}
	},

	invertAtCircle: function(invCircle) {
		return geom.invertLine(this, invCircle);
	}
});
