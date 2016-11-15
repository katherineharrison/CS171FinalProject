// Timeline Visualization
Timeline = function(_parentElement, _data){
	this.parentElement = _parentElement;
	this.data = _data;
	this.displayData = _data;

	this.initVis();
};

Timeline.prototype.initVis = function() {
	var vis = this;

	vis.margin = { top: 40, right: 0, bottom: 60, left: 60 };

	vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right,
		vis.height = 300 - vis.margin.top - vis.margin.bottom;

	// SVG drawing area
	vis.svg = d3.select("#" + vis.parentElement).append("svg")
		.attr("width", vis.width + vis.margin.left + vis.margin.right)
		.attr("height", vis.height + vis.margin.top + vis.margin.bottom)
		.append("g")
		.attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

	var minMaxX = d3.extent(vis.data.map(function(d){ return d.dateend; }));

	vis.svg.append("text")
		.text("minimum and maximum dates: " + minMaxX);

	// TO DO

	vis.wrangleData();
};

Timeline.prototype.wrangleData = function() {
	var vis = this;

	// console.log(vis.data);

	// TO DO

	vis.updateVis();	
};

Timeline.prototype.updateVis = function() {
	var vis = this;

	// TO DO
};
