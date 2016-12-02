// Color Visualization

ColorVis = function(_parentElement, _data){
	this.parentElement = _parentElement;
	this.data = _data;
	this.displayData = _data;

	this.initVis();
};

ColorVis.prototype.initVis = function() {
	var vis = this;

	// TO DO
	vis.margin = { top: 0, right: 60, bottom: 60, left: 20 };

	vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right,
		vis.height = 150 - vis.margin.top - vis.margin.bottom;

	vis.tooltip = d3.select("#" + vis.parentElement).append("div")
	.attr("class", "tooltip")
	.style("opacity", 0);

	// SVG drawing area
	vis.svg = d3.select("#" + vis.parentElement).append("svg")
		.attr("width", vis.width + vis.margin.left + vis.margin.right)
		.attr("height", vis.height + vis.margin.top + vis.margin.bottom)
		.append("g")
		.attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

	vis.wrangleColorData();
};

ColorVis.prototype.wrangleColorData = function() {
	var vis = this;

	console.log(vis.data);
	
	// var selectBox = document.getElementById("selectBoxColor");
 //    var selection = selectBox.options[selectBox.selectedIndex].value;

	vis.col = vis.data.filter(function(d) {
		var colorObjects = d.colors;
		for (i = 0; i < colorObjects.length; i++) {
			if (d.colors[i].hue == vis.parentElement) {
				return d;
			}
		}
	});
	vis.filtered = vis.col.filter(function(d) {
		if (d.classification == "Paintings" || d.classification == "Drawings") {
			return d;
		}
	});

	vis.updateVis();	
};

ColorVis.prototype.updateVis = function() {
	var vis = this;

	// var selectBox = document.getElementById(vis.parentElement);
 //    var selection = selectBox.options[selectBox.selectedIndex].value;

	vis.rectangles = vis.svg.selectAll("rect").data(vis.filtered);

	vis.rectangles.enter().append("rect");

	vis.rectangles.exit().remove();

    vis.rectangles.attr("x", function(d, index) {
					return index * vis.width / vis.filtered.length;
				})
				.attr("y", "0")
				.attr("width", function() {
					return vis.width / vis.filtered.length;
				})
				.attr("height", "150")
				.attr("fill", function(d) {
					var colorObject = d.colors;
					for (i = 0; i < colorObject.length; i++) {
						if (d.colors[i].hue == vis.parentElement) {
							console.log(d.colors[i].color);
							return d.colors[i].color;
						}
					}
				})
				.on("mouseover", function(d) {
					vis.tooltip.transition()
						.duration(200)
						.style("opacity", .9)
						.style("background", "white");
					vis.tooltip.html(d.title + "<br/>")
						.style("left", (d3.event.pageX + 5) + "px")
						.style("top", (d3.event.pageY - 28) + "px");
				})
				.on("mouseout", function(d) {
					vis.tooltip.transition()
						.duration(500)
						.style("opacity", 0);
				});

};
