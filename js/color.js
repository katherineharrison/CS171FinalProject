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
		vis.height = 200 - vis.margin.top - vis.margin.bottom;

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

 	var start_val = 0,
    duration = 5000,
    end_val = [vis.filtered.length];

	var qSVG = d3.select("#" + vis.parentElement + "Count").append("svg").attr("width", 100).attr("height", 60);

	qSVG.text(vis.filtered.length);
	    // .data(end_val)
	    // .enter()
	    // .append("text")
	    // .text(start_val)
	    // .attr("class", "colorText")
	    // .attr("x", 0)
	    // .attr("y", 50)
	    // .transition()
	    // .duration(3000)
	    //     .tween("text", function(d) {
	    //         var i = d3.interpolate(this.textContent, d),
	    //             prec = (d + "").split("."),
	    //             round = (prec.length > 1) ? Math.pow(10, prec[1].length) : 1;

	    //         return function(t) {
	    //             this.textContent = Math.round(i(t) * round) / round;
	    //         };
	    //     });

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
				.attr("height", "200")
				.attr("fill", function(d) {
					var colorObject = d.colors;
					for (i = 0; i < colorObject.length; i++) {
						if (d.colors[i].hue == vis.parentElement) {
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
