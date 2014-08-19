

var Shape = xbase.Control.extend({
	init: function() {
		this._super();
	},

	drawOn: function(paper) {
		console.error("Method drawOn was not implemented!");
	},

	remove: function() {
		console.error("Method remove was not implemented!");
	},

	copy: function(shape) {
		console.error("Method copy was not implemented!");
	}
});



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



var Point = Shape.extend({
	// TODO: add label
	init: function(x, y) {
		this._super();
		this.x = x;
		this.y = y;
	},


	drawOn: function(paper) {
		this._p = paper.circle(this.x, this.y, 2);
		return this;
	},


	remove: function() {
		this._p.remove();
	},


	copy: function(otherPoint) {
		this.x = x;
		this.y = y;
		// TODO: update position of this._p;
	}
});


