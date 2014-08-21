




var Shape = xbase.Control.extend({
	init: function() {
		this._super();
		this.isVisible = false;
		this.doInvert = true
	},

	showOn: function(svg) {
		if (!this.isVisible) {
			this._drawOn(svg);
			this.isVisible = true;
		}
		return this;
	},


	hide: function() {
		if (this.isVisible) {
			this._remove();
			this.isVisible = false;
		}
		return this;
	},


	dontInvert: function() {
		this.doInvert = false;
		return this;
	},


	copy: function(shape) {
		console.error("Method copy was not implemented!");
	},


	_remove: function() {
		console.error("Method remove was not implemented!");
	},


	_drawOn: function(svg) {
		console.error("Method drawOn was not implemented!");
	},


	setType: function(svg) {
		console.warn("Method setType was not implemented!");
	}
});





var Point = Shape.extend({
	// TODO: add label
	init: function(x, y) {
		this._super();
		this.x = x;
		this.y = y;
	},


	_drawOn: function(svg) {
		this._svg = d3adapter.circle(svg, this.x, this.y, 2);
		return this;
	},


	_remove: function() {
		this._svg.remove();
	},


	copy: function(otherPoint) {
		this.x = x;
		this.y = y;
		// TODO: update position of this._svg;
	}
});


var Line = Shape.extend({
	// Line => x = origin + t * vector
	
	init: function(x, y, dx, dy) {
		this._super();
		this._origin = new Point(x, y);
		this._vector = new geom.Vector(dx, dy).normalized();
	},

	copy: function(otherLine) {
		console.warn("Implement copy");
	},

	_drawOn: function(svg) {
		this._svg = svg.append("line")
			.attr("x1", this._origin.x - this._vector.x*1000)
			.attr("y1", this._origin.y - this._vector.y*1000)
			.attr("x2", this._origin.x + this._vector.x*1000)
			.attr("y2", this._origin.y + this._vector.y*1000);
		return this;
	},

	_remove: function() {
		this._svg.remove();
	}
});


var Polygon = Shape.extend({
	// TODO: Make movable
	init: function(points) {
		this._super();
		this.setPoints(points);
		this._type = 'normal';
	},


	copy: function(otherPolygon) {
		this.setPoints(otherPolygon._points);
		this._svg.attr('points', this._buildPointsAttr());
	},


	setPoints: function(newPoints) {
		var points = [];
		$.each(newPoints, function(i, pt) {
			if (pt instanceof Point) {
				points.push(pt);
			} else if (pt instanceof Array) {
				points.push(new Point(pt[0], pt[1]));
			} else {
				points.push(new Point(pt.x, pt.y));
			}
		});
		this._points = points;
		this._pointsString = "";
	},


	_buildPointsAttr: function() {
		// TODO: Catch infity points
		var pointsString = "";
		$.each(this._points, function(i, pt) {
			pointsString += pt.x + ',' + pt.y + ' ';
		});
		return pointsString;
	},


	_drawOn: function(svg) {
		this._svg = svg.append('polygon')
			.attr('points', this._buildPointsAttr());
		this._applyClasses();
		return this;
	},


	_remove: function() {
		this._svg.remove();
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
});


var Rectangle = Polygon.extend({
	init: function(x, y, w, h) {
		var p1 = [x, y],
			p2 = [x + w, y],
			p3 = [x + w, y + h],
			p4 = [x, y + h];

		this._super([p1, p2, p3, p4]);
	}
});