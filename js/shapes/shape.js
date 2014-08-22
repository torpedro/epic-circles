

var Shape = xbase.Control.extend({
	init: function() {
		this._super();
		this.isVisible = false;
		this.doInvert = true
	},

	showOn: function(svg) {
		if (!this.isVisible) {
			this._showOn(svg);
			this.isVisible = true;
		}
		return this;
	},


	hide: function() {
		if (this.isVisible) {
			this._hide();
			this.isVisible = false;
		}
		return this;
	},


	copy: function(shape) {
		console.error("Method copy was not implemented!");
	},


	_hide: function() {
		console.error("Method remove was not implemented!");
	},


	_showOn: function(svg) {
		console.error("Method drawOn was not implemented!");
	},


	setType: function(svg) {
		console.warn("Method setType was not implemented!");
	},

	remove: function() {
		this.hide();
		console.warn("Method remove was not implemented! Just hiding!");
	}
});

