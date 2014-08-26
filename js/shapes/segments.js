
/**
 * @class LineSegment
 */
var LineSegment = Shape.extend({
	init: function(x1, y1, x2, y2) {
		this._super();
		this.x1 = x1; this.y1 = y1;
		this.x2 = x2; this.y2 = y2;
	},


	getPosition: function() {
		var x = (this.x1 + this.x2) / 2;
		var y = (this.y1 + this.y2) / 2;
		return {
			'x': x,
			'y': y
		}
	},


	_showOn: function(svg) {
		if (this._svg) {
			this._svg.style('visibility', '');
			return this;
		}

		this._parent = svg;
		this._svg = svg.append('g');

		var line = this._svg.append('line')
			.attr('x1', this.x1)
			.attr('y1', this.y1)
			.attr('x2', this.x2)
			.attr('y2', this.y2);

		var center = this.getPosition();
		// var origin = this._svg.append('circle')
		// 	.attr("cx", center.x)
		// 	.attr("cy", center.y)
		// 	.attr("r", 5)
		// 	.classed("origin", "true");

		this._applyClasses();
		return this;
	},

	_applyClasses: function() {
		if (this._svg) {
			this._svg.attr('class', 'lineSegment ' + this._type);
		}
	},


	invertAtCircle: function(invCircle) {
		return geom.invertLineSegment(this, invCircle);
	}
});


/**
 * @class CircleSegment
 */
var CircleSegment = Shape.extend({
	// center, radius, start angle, end angle
	init: function(cx, cy, r, a, b) {
		this._super();
		this.cx = cx; this.cy = cy;
		this.r = r;

		while (a > b) b += 2*Math.PI;
		console.log(a, b);
		this.a = a;
		this.b = b;
	},

	_showOn: function(svg) {
		if (this._svg) {
			this._svg.style('visibility', '');
			return this;
		}

		this._parent = svg;

		// Angles
		// 0 => top 
		// pi/2 => right
		// pi => bottom
		// 3pi/2 => left
		var arc = d3.svg.arc()
		    .innerRadius(this.r)
		    .outerRadius(this.r)
		    .startAngle(this.a)
		    .endAngle(this.b);

		this._svg = svg.append("path")
		    .attr("d", arc)
		    .attr("transform", "translate(" + this.cx + ", " + this.cy + ")");

		this._applyClasses();
	},

	_applyClasses: function() {
		if (this._svg) {
			this._svg.attr('class', 'circleSegment ' + this._type);
		}
	},

	copy: function(otherCurve) {
		this.cx = otherCurve.cx;
		this.cy = otherCurve.cy;
		this.a = otherCurve.a;
		this.b = otherCurve.b;
		this.r = otherCurve.r;
		this.remove();
		this._showOn(this._parent);
	},

	remove: function() {
		this._svg.remove();
		this._svg = null;
	}
})