
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
			.attr('x1', this._origin.x - this._vector.x*6000)
			.attr('y1', this._origin.y - this._vector.y*6000)
			.attr('x2', this._origin.x + this._vector.x*6000)
			.attr('y2', this._origin.y + this._vector.y*6000);

		var origin = this._svg.append('circle')
			.attr("cx", this._origin.x)
			.attr("cy", this._origin.y)
			.attr("r", 5)
			.classed("origin", "true");

		var rotator = this._svg.append('circle')
			.attr("cx", this._origin.x + this._vector.x*25)
			.attr("cy", this._origin.y + this._vector.y*25)
			.attr("r", 5)
			.classed("rotator", "true");


		var self = this;
		Shape.makeDraggable(origin, svg.canvas, this.setPosition, this);

		Shape.makeDraggable(rotator, svg.canvas, function(x, y) {
			var dx = x - this._origin.x;
			var dy = y - this._origin.y;
			this._vector = new geom.Vector(dx, dy).normalized();
			this.remove();
			this.showOn(this._parent);
			this.trigger('move');
		}, this);

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
