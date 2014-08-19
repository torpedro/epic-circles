
var d3adapter = {
	
	circle: function(svg, x, y, r) {
		return svg.append("circle")
			.attr("cx", x)
			.attr("cy", y)
			.attr("r", r);
	}


}