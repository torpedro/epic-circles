
if (typeof geom === "undefined") geom = {};


geom.Vector = xbase.Class.extend({
	init: function(x, y) {
		if (x instanceof Vector) this._v = x;
		else this._v = $V([x, y]);
	},

	x: function(x) {
		if (!x) return this._v.e(1);
		this._v.setElements([x, this.y()]);
		return this;
	},

	y: function(y) {
		if (!y) return this._v.e(2);
		this._v.setElements([this.x(), y]);
		return this;
	},

	length: function() {
		return this._v.distanceFrom($V([0, 0]));
	},

	normalized: function() {
		return gVector(this._v.toUnitVector());
	},

	angleFrom: function(vector) {
		return this._v.angleFrom(vector._v);
	},

	rotate: function(angle, vector) {
		if (!vector) vector = gVector(0, 0);
		return gVector(this._v.rotate(angle, vector._v));
	},

	sub: function(vector) { return gVector(this._v.subtract(vector._v)); },
	add: function(vector) { return gVector(this._v.add(vector._v)); },
	mul: function(scalar) { return gVector(this._v.multiply(scalar)); },
	dot: function(vector) { return this._v.dot(vector._v); },

	toString: function() { return '('+this.x()+', '+this.y()+')'; }
});

var gVector = function(x, y) { return new geom.Vector(x, y); };



/**
 * Inverts a point at the given inversion circle
 * @param geom.Vector vector  vector to be inverted
 * @param Circle invCircle    inversion circle
 * @return Point
 */
geom.invertVector = function(vector, invCircle) {
	// OA x OA' = r*r
	var dx = vector.x() - invCircle.x,
		dy = vector.y() - invCircle.y;

	var sign_x = (dx > 0) ? 1 : -1;
	var sign_y = (dy > 0) ? 1 : -1;

	var d = Math.sqrt(dx*dx + dy*dy);

	var d2 = (invCircle.r * invCircle.r) / d;

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

	return gVector(invCircle.x + dx2, invCircle.y + dy2);
}