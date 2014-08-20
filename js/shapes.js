


var Vector = xbase.Class.extend({
	init: function(x, y) {
		this.x = x;
		this.y = y;
	},


	length: function() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	},


	normalized: function() {
		var len = this.length();
		return new Vector(this.x/len, this.y/len);
	}
});


var Shape = xbase.Control.extend({
	init: function() {
		this._super();
		this.isVisible = false;
	},

	showOn: function(svg) {
		if (!this.isVisible) {
			this._drawOn(svg);
			this.isVisible = true;
		}
	},


	hide: function() {
		if (this.isVisible) {
			this._remove();
			this.isVisible = false;
		}
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


	drawOn: function(svg) {
		this._svg = d3adapter.circle(svg, this.x, this.y, 2);
		return this;
	},


	remove: function() {
		this._svg.remove();
	},


	copy: function(otherPoint) {
		this.x = x;
		this.y = y;
		// TODO: update position of this._svg;
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