

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



var Point = xbase.Control.extend({
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
	}
});


