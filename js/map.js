// Map Visualization

Map = function(_parentElement, _data){
	this.parentElement = _parentElement;
	this.data = _data;
	this.displayData = _data;

	this.initVis();
};

Map.prototype.initVis = function() {
	var vis = this;

	console.log(vis.data);
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

//  This will not end up being the architecture as we
//  we will have to load in a geoJSON, but it'll work for now.