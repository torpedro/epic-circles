

var Polygon = Shape.extend({
	// TODO: Make movable
	init: function(points) {
		this._super();
		this.setPoints(points);
		this._type = 'normal';
	},


	copy: function(otherPolygon) {
		this.setPoints(otherPolygon._points);
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

		this._updatePolygonPointsAttr();
	},

	_updatePolygonPointsAttr: function() {
		if (!this._polygon) return;

		// TODO: Catch infity points
		var pointsString = "";
		$.each(this._points, function(i, pt) {
			pointsString += pt.x + ',' + pt.y + ' ';
		});

		this._polygon.attr('points', pointsString);

		var center = this.getCenter();
		this._origin.attr('cx', center.x)
			.attr('cy', center.y);

		this.trigger('move');
	},


	_showOn: function(svg) {
		if (this._svg) {
			this._svg.style('visibility', '');
			return this;
		}

		this._svg = svg.append('g');

		this._polygon = this._svg.append('polygon');

		this._origin = this._svg.append('circle')
			.attr('r', 5)
			.classed("origin", "true");

		this._updatePolygonPointsAttr();

		Shape.makeDraggable(this._origin, svg.canvas, this.setCenter, this);

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
			this._svg.attr("class", 'polygon ' + this._type);
		}
	},

	invertAtCircle: function(circle) {
		return geom.invertPolygon(this, circle);
	},

	remove: function() {
		this._svg.remove();
		this._svg = null;
	},


	getCenter: function() {
		var xSum = 0,
			ySum = 0;
		$.each(this._points, function(i, point) {
			xSum += point.x;
			ySum += point.y;
		});
		return {
			'x': xSum / this._points.length,
			'y': ySum / this._points.length
		}
	},

	setCenter: function(x, y) {
		// calculate diff to current center
		var center = this.getCenter();
		var diffX = x - center.x;
		var diffY = y - center.y;

		$.each(this._points, function(i, point) {
			point.x += diffX;
			point.y += diffY;
		});

		this._updatePolygonPointsAttr();
	}
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

var Triangle = Polygon.extend({
	init: function(x, y, r) {
		var points = Circle.calculatePoints(x, y, r, 3, Math.PI)
		this._super(points);
	}
});