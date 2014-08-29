
/**
 * @class Shape
 * Abstract base class for any shape
 */
var Shape = xbase.Control.extend({
	render: function(svg) {
		console.error("Shape.render was not implemented!");
	},

	copy: function(shape) {
		console.error("Shape.copy was not overridden!");
	},

	invertAtCircle: function(circle) {
		console.error("Shape.invertAtCircle was not overridden!");
	},

	show: function() {
		this.isVisible = true;
		this._svg.style('visibility', '');
		return this;
	},

	hide: function() {
		this.isVisible = false;
		this._svg.style('visibility', 'hidden');
		return this;
	},

	canvas: function() {
		return this._parent.canvas;
	},

	remove: function() {
		this._svg.remove();
		this._svg = null;
		return this;
	},

	setClasses: function(classes) {
		this._classes = classes;
		this._applyClasses();
		return this;
	},

	_applyClasses: function() {
		if (this._svg) {
			this._svg.attr("class", this._shapeKind + ' ' + this._classes);
		}
		return this;
	},

	init: function() {
		this._super();
		this._svg = null;
		this._parent = null;
		this._shapeKind = 'NoType';
		this.isVisible = false;
	}
});


/**
 * @class TransformableShape
 * Extension of the abstract base class Shape
 */
var TransformableShape = Shape.extend({
	onMove: function(x, y) {
		console.warn("TransformableShape.onMove was not overridden!")
	},

	onResize: function(x, y) {
		console.warn("TransformableShape.onResize was not overridden!")
	},

	_setMoveHandle: function(svgHandle) {
		TransformableShape.makeDraggable(svgHandle, this, this.onMove);
	},

	_setResizeHandle: function(svgHandle) {
		TransformableShape.makeDraggable(svgHandle, this, this.onResize);
	}
});



TransformableShape.makeDraggable = function(draggableSVG, shape, callback) {
	var moveCallback = function(e) {
		var p = shape.canvas().convertScreen(e.clientX, e.clientY);
		callback.call(shape, p.x, p.y);
	};
	draggableSVG.on("mousedown", function() {
		window.addEventListener('mousemove', moveCallback, true);
	}, false);
	window.addEventListener("mouseup", function() {
		window.removeEventListener('mousemove', moveCallback, true);
	}, false);
};