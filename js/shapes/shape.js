

var Shape = xbase.Control.extend({
	init: function() {
		this._super();
		this.isVisible = false;
	},
	

	showOn: function(svg) {
		if (!this._svg || !this.isVisible) {
			this._showOn(svg);
			this.isVisible = true;
		}
		return this;
	},


	hide: function() {
		if (this._svg && this.isVisible) {
			this._hide();
			this.isVisible = false;
		}
		return this;
	},


	copy: function(shape) {
		console.error("Method copy was not implemented!");
	},


	_hide: function() {
		console.error("Method _hide was not implemented!");
	},


	_showOn: function(svg) {
		console.error("Method _showOn was not implemented!");
	},


	setType: function(svg) {
		console.warn("Method setType was not implemented!");
	},


	remove: function() {
		this.hide();
		console.warn("Method remove was not implemented! Just hiding!");
	},


	invertAtCircle: function(circle) {
		console.error("Method invertAtCircle was not implemented!");
	}
});



Shape.makeDraggable = function(draggableSVG, canvas, callback, context) {
	var move = function(e) {
		var p = canvas.convertScreen(e.clientX, e.clientY);
		callback.call(context, p.x, p.y);
	};
	draggableSVG.on("mousedown", function() {
		window.addEventListener('mousemove', move, true);
	}, false);
	window.addEventListener("mouseup", function() {
		window.removeEventListener('mousemove', move, true);
	}, false);
};