

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
		this.updatePosition(otherCircle.x, otherCircle.y);
		this._circle.attr('r', otherCircle.r);
		return true;
	},


	_showOn: function(svg) {
		if (this._circle) {
			this._circle.style('visibility', '');
			this._origin.style('visibility', '');
			return this;
		}

		var self = this;
		this._circle = d3adapter.circle(svg, this.x, this.y, this.r);
		this._origin = d3adapter.circle(svg, this.x, this.y, 5);
		this._applyClasses();

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

	
	_hide: function() {
		this._circle.style('visibility', 'hidden');
		this._origin.style('visibility', 'hidden');
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
		this._applyClasses();
	},


	_applyClasses: function() {
		if (this._circle) {
			this._circle.attr("class", "circle " + this._type);
			this._origin.attr("class", "origin " + this._type);
		}
	},


	invertShape: function(shape) {
		if (shape instanceof Point) return geom.invertPoint(shape, this);
		if (shape instanceof Circle) return geom.invertCircle(shape, this);
		if (shape instanceof Polygon) return geom.invertPolygon(shape, this);
		if (shape instanceof Line) return geom.invertLine(shape, this);
		return null;
	}
});
