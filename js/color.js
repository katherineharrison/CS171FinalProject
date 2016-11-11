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

	vis.wrangleData();
};

ColorVis.prototype.wrangleData = function() {
	var vis = this;

	// TO DO

	vis.updateVis();	
};

ColorVis.prototype.updateVis = function() {
	var vis = this;

	// TO DO
};

//  Data Notes
//  Colors are generalized by "hue"