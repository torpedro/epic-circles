

var Circle = Shape.extend({
	init: function(x, y, r) {
		this._super();
		this.x = x;
		this.y = y;
		this.r = r;
		this.setType("normal");
	},





	copy: function(otherCircle) {
		this.updatePosition(otherCircle.x, otherCircle.y);
		this._circle.attr('r', otherCircle.r);
	},


	_drawOn: function(svg) {
		var self = this;

		this._circle = d3adapter.circle(svg, this.x, this.y, this.r);
		this._origin = d3adapter.circle(svg, this.x, this.y, 5);
		this._updateClasses();

		var move = function(e) {
			var p = svg.convertScreen(e.clientX, e.clientY);
			self.updatePosition(p.x, p.y);
		};
		this._origin.on("mousedown", function() {
			window.addEventListener('mousemove', move, true);
		}, false);
		window.addEventListener("mouseup", function() {
			window.removeEventListener('mousemove', move, true);
		}, false);

		return this;
	},

	
	_remove: function() {
		this._circle.remove();
		this._origin.remove();
	},


	updatePosition: function(x, y) {
		this.x = x;
		this.y = y;
		this._circle.attr('cx', x);
		this._circle.attr('cy', y);
		this._origin.attr('cx', x);
		this._origin.attr('cy', y);
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
		this._updateClasses();
	},


	_updateClasses: function() {
		if (this._circle) {
			this._circle.attr("class", "circle " + this._type);
			this._origin.attr("class", "origin " + this._type);
		}
	},


	invertShape: function(shape) {
		if (shape instanceof Point) return this._invertPoint(shape);
		if (shape instanceof Circle) return this._invertCircle(shape);
		if (shape instanceof Polygon) return this._invertPolygon(shape);
		return null;
	},


	_invertPoint: function(pt) {
		// OA x OA' = r*r
		var dx = pt.x - this.x,
			dy = pt.y - this.y;

		var sign_x = (dx > 0) ? 1 : -1;
		var sign_y = (dy > 0) ? 1 : -1;

		var d = Math.sqrt(dx*dx + dy*dy);

		var d2 = (this.r * this.r) / d;

		if (dx == 0) {
			var dx2 = 0;
			var dy2 = d2;
		} else {
			var ratio = Math.abs(dy / dx);
			var dx2 = d2 / Math.sqrt(1 + ratio*ratio);
			var dy2 = dx2 * ratio;
		}

		dx2 *= sign_x;
		dy2 *= sign_y;

		return new Point(this.x + dx2, this.y + dy2);
	},


	_invertCircle: function(circle) {
		// calculate closest and farthest point of circle
		// invert those and calculate center and radius
		var v = new Vector(this.x - circle.x, this.y - circle.y)
		var vn = v.normalized();

		var p1 = new Point(
			circle.x + vn.x * circle.r,
			circle.y + vn.y * circle.r
		);
		var p2 = new Point(
			circle.x - vn.x * circle.r,
			circle.y - vn.y * circle.r
		);

		// Invert points
		var p1i = this._invertPoint(p1);
		var p2i = this._invertPoint(p2);

		// Calculate origin and radius of new circle
		var v_diameter = new Vector(
			p1i.x - p2i.x,
			p1i.y - p2i.y
		);
		var r_new = v_diameter.length() / 2;
		var cx = p1i.x - v_diameter.x/2;
		var cy = p1i.y - v_diameter.y/2;
		var newCircle = new Circle(cx, cy, r_new);
		newCircle.setType('inverted');
		return newCircle;
	},


	_invertPolygon: function(polygon) {
		var self = this;
		var newPoints = [];
		$.each(polygon._points, function(i, pt) {
			var invPt = self._invertPoint(pt);
			newPoints.push(invPt);
		});
		var invertedShape = new Polygon(newPoints);
		return invertedShape;
	}
});
