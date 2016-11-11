// Timeline Visualization
Timeline = function(_parentElement, _data){
	this.parentElement = _parentElement;
	this.data = _data;
	this.displayData = _data;

	this.initVis();
};

Timeline.prototype.initVis = function() {
	var vis = this;

	// TO DO

	vis.wrangleData();
};

Timeline.prototype.wrangleData = function() {
	var vis = this;

	// TO DO

	vis.updateVis();	
};

Timeline.prototype.updateVis = function() {
	var vis = this;

	// TO DO
};
