// Map Visualization

Map = function(_parentElement, _data){
	this.parentElement = _parentElement;
	this.data = _data;
	this.displayData = _data;

	this.initVis();
};

Map.prototype.initVis = function() {
	var vis = this;

	// TO DO

	vis.wrangleData();
};

Map.prototype.wrangleData = function() {
	var vis = this;

	// TO DO

	vis.updateVis();	
};

Map.prototype.updateVis = function() {
	var vis = this;

	// TO DO
};