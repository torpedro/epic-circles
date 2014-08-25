

var Circle = Shape.extend({
	init: function(x, y, r) {
		this._super();
		this.x = x;
		this.y = y;
		this.r = r;
		this.setType("normal");
	},


	copy: function(otherCircle) {
		if (!(otherCircle instanceof Circle)) return false;
		this.setPosition(otherCircle.x, otherCircle.y);
		this.setRadius(otherCircle.r);
		return true;
	},


	_showOn: function(svg) {
		if (this._svg) {
			this._svg.style('visibility', '');
			return this;
		}

		var self = this;
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

		// Move Handler
		Shape.makeDraggable(this._origin, svg.canvas, this.setPosition, this);

		// Resize Handler
		Shape.makeDraggable(this._circle, svg.canvas, function(x, y) {
			var r = $V([x, y]).distanceFrom($V([self.x, self.y]));
			self.setRadius(r);
		});

		return this;
	},

	
	_hide: function() {
		this._svg.style('visibility', 'hidden');
	},


	remove: function() {
		this._svg.remove();
		this._svg = null;
	},


	setPosition: function(x, y) {
		this.x = x;
		this.y = y;
		this._circle.attr('cx', x);
		this._circle.attr('cy', y);
		this._origin.attr('cx', x);
		this._origin.attr('cy', y);
		this.trigger('move');
	},


	setRadius: function(r) {
		this.r = r;
		this._circle.attr('r', r);
		this.trigger('move');
	},


	calculatePoints: function(num) {
		var step = (2*3.14159) / num;
		var points = [];
		for (var i = 0; i < num; ++i) {
			var p = new Point(
				this.x + Math.sin(step*i) * this.r,
				this.y + Math.cos(step*i) * this.r
			);
			points.push(p);
		}
		return points;
	},


	setType: function(type) {
		this._type = type;
		this._applyClasses();
	},


	_applyClasses: function() {
		if (this._svg) {
			this._svg.attr("class", "circle " + this._type);
		}
	},

	invertAtCircle: function(invCircle) {
		return geom.invertCircle(this, invCircle);
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