
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
		console.warn('TODO: Implement copy');
	},

	remove: function() {
		this._svg.remove();
		this._svg = null;
	},

	_showOn: function(svg) {
		if (this._svg) {
			this._svg.style('visibility', '');
			return this;
		}

		this._parent = svg;
		this._svg = svg.append('g');

		var line = this._svg.append('line')
			.attr('x1', this._origin.x - this._vector.x*1000)
			.attr('y1', this._origin.y - this._vector.y*1000)
			.attr('x2', this._origin.x + this._vector.x*1000)
			.attr('y2', this._origin.y + this._vector.y*1000);

		var origin = this._svg.append('circle')
			.attr("cx", this._origin.x)
			.attr("cy", this._origin.y)
			.attr("r", 5)
			.classed("origin", "true");


		var self = this;
		Shape.makeDraggable(origin, svg.canvas, this.setPosition, this);

		this._applyClasses();
		
		return this;
	},

	setPosition: function(x, y) {
		this._origin.x = x;
		this._origin.y = y;
		this.remove();
		this.showOn(this._parent);
		this.trigger('move');
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
			this._svg.attr('class', 'line ' + this._type);
		}
	},

	invertAtCircle: function(invCircle) {
		return geom.invertLine(this, invCircle);
	},


	remove: function() {
		this._svg.remove();
		this._svg = null;
	}
});
