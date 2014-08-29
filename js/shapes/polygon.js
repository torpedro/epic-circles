/**
 * @class Polygon
 * Implementation of a polygon shape
 */
var Polygon = TransformableShape.extend({
	// @overridden
	init: function(points) {
		this._super();
		this._shapeKind = 'polygon';
		this.setPoints(points);
	},


	// @overridden
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
		this._origin.attr('cx', center.x()).attr('cy', center.y());
		this._rotator.attr('cx', center.x() + this._direction.x()*18).attr('cy', center.y() + this._direction.y()*18);

		this.trigger('move');
	},


	// @overridden
	render: function(svg) {
		this._parent = svg;
		this._svg = svg.append('g');

		this._polygon = this._svg.append('polygon');

		this._origin = this._svg.append('circle')
			.attr('r', 5)
			.classed("origin", "true");

		this._rotator = this._svg.append('circle')
			.attr('r', 5)
			.classed("rotator", "true");

		this._direction = new geom.Vector(1, -1).normalized();
		this._setMoveHandle(this._origin);
		this._setResizeHandle(this._rotator);

		this._updatePolygonPointsAttr();
		this._applyClasses();
		return this;
	},

	// @overridden
	onMove: function(x, y) { return this.setCenter(x, y); },

	// @overridden
	onResize: function(x, y) {
		var v = new geom.Vector(x, y);
		var center = this.getCenter();
		var newDirection = v.sub(center).normalized();
		var angle = newDirection.angleFrom(this._direction);

		// We need to figure out if this rotation is clockwise or counter-clockwise.
		// We do half the rotation we just calculated and calculate the new angle.
		// We'd expect the new angle to be smaller, because we've already rotated half way.
		// If this angle is greater than the original angle, we have a counter-clockwise rotation.
		var half = this._direction.rotate(angle/2);
		var angle2 = newDirection.angleFrom(half);
		if (angle2 > angle) {
			angle *= -1;
		}

		this._direction = newDirection;
		this._rotate(angle);
	},

	// @overridden
	invertAtCircle: function(circle) {
		var newPoints = [];
		$.each(this._points, function(i, pt) {
			var invPt = pt.invertAtCircle(circle);
			newPoints.push(invPt);
		});
		var invertedShape = new Polygon(newPoints);
		return invertedShape;
	},
	

	getCenter: function() {
		var xSum = 0,
			ySum = 0;
		$.each(this._points, function(i, point) {
			xSum += point.x;
			ySum += point.y;
		});
		return new geom.Vector(xSum / this._points.length, ySum / this._points.length);
	},


	setCenter: function(x, y) {
		// calculate diff to current center
		var center = this.getCenter();
		var diffX = x - center.x();
		var diffY = y - center.y();

		$.each(this._points, function(i, point) {
			point.x += diffX;
			point.y += diffY;
		});

		this._updatePolygonPointsAttr();
	},


	_rotate: function(angle) {
		var vCenter = this.getCenter();

		$.each(this._points, function(i, point) {
			var v = new geom.Vector(point.x, point.y);
			v = v.rotate(angle, vCenter);
			point.x = v.x();
			point.y = v.y();
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