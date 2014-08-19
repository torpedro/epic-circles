
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
})



var InversionCircle = xbase.Control.extend({
	init: function(x, y, r) {
		this._super();
		this.x = x;
		this.y = y;
		this.r = r;
	},

	drawOn: function(paper) {
		var self = this;

		this._circle = paper.circle(this.x, this.y, this.r);
		this._origin = paper.circle(this.x, this.y, 5);
		this._circle.node.setAttribute("class", "inversion-circle");
		this._origin.node.setAttribute("class", "inversion-origin");

		// TODO: drag at point where it was clicked
		// instead of always at the center
		var move = function(e) {
			var x = e.clientX - paper.canvas.offsetLeft;
			var y = e.clientY - paper.canvas.offsetTop;
			self.updatePosition(x, y);
		};
		this._origin.node.addEventListener("mousedown", function() {
			window.addEventListener('mousemove', move, true);
		}, false);
		this._origin.node.addEventListener("mouseup", function() {
			window.removeEventListener('mousemove', move, true);
		}, false);
		return this;
	},


	updatePosition: function(x, y) {
		this.x = x;
		this.y = y;
		this._circle.node.setAttribute('cx', x);
		this._circle.node.setAttribute('cy', y);
		this._origin.node.setAttribute('cx', x);
		this._origin.node.setAttribute('cy', y);
		this.trigger('moved');
	},


	invertPoint: function(p) {
		// OA x OA' = r*r
		var dx = p.x - this.x,
			dy = p.y - this.y;

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
	}
});

