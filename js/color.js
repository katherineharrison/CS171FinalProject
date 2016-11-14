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
	vis.margin = { top: 0, right: 0, bottom: 60, left: 60 };

	vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right,
		vis.height = 300 - vis.margin.top - vis.margin.bottom;

	// SVG drawing area
	vis.svg = d3.select("#" + vis.parentElement).append("svg")
		.attr("width", vis.width + vis.margin.left + vis.margin.right)
		.attr("height", vis.height + vis.margin.top + vis.margin.bottom)
		.append("g")
		.attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

	vis.wrangleData();
};

ColorVis.prototype.wrangleData = function() {
	var vis = this;

	console.log(vis.data);
	// TO DO
	vis.col = vis.data.filter(function(d) {
		console.log(d.colors);
		var colorObjects = d.colors;
		for (i = 0; i < colorObjects.length; i++) {
			if (d.colors[i].hue == "Grey") {
				return d;
			}
		}
	});
	vis.filtered = vis.col.filter(function(d) {
		console.log(d.classification);
		if (d.classification == "Paintings" || d.classification == "Drawings") {
			return d;
		}
	});

	vis.updateVis();	
};

ColorVis.prototype.updateVis = function() {
	var vis = this;

	// TO DO
	vis.images = vis.svg.selectAll("image").data(vis.filtered)
				.enter()
            	.append("svg:image")
    	        .attr("xlink:href", function(d, index) {
    	        	var imagesObject = d.images;
    	        	if(imagesObject.length > 0) {
	    	        	return imagesObject[0].baseimageurl;
    	        	}
    	        })
		        .attr("x", function(d, index) {
		        	return index * vis.width / vis.filtered.length;
		        })
		        .attr("y", "0")
		        .attr("width", function() {
		        	return vis.width / vis.filtered.length;
		        })
		        .attr("height", "200");

};

//  Data Notes
//  Colors are generalized by "hue"