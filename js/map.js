// Map Visualization

Map = function(_parentElement, _data){
	this.parentElement = _parentElement;
	this.data = _data;
	this.displayData = _data;

	this.initVis();
};

Map.prototype.initVis = function() {
	var vis = this;

	var width = 900,
		height = 600;

	var svg = d3.select("#" + vis.parentElement).append("svg")
		.attr("width", width)
		.attr("height", height);

	// var projection = d3.geo.mercator()
	// 	.scale(200)
	// 	.translate([width / 2, height / 2])
	// 	.precision(.1);

	// var path = d3.geo.path()
	// 	.projection(projection);
	// 	var map = L.map('map');


	// 	var Stamen_Watercolor = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
	// 	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
	// 	subdomains: 'abcd',
	// 	minZoom: 1,
	// 	maxZoom: 16,
	// 	ext: 'png'
	// 	});

var map = L.map('map').setView([14.5994, 28.6731], 3);

	// title layer to map
	L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.png', {
		minZoom: 2,
		maxZoom: 16
	}).addTo(map);

	// If the images are in the directory "/img":
	L.Icon.Default.imagePath = '/lab9/img/';


	// // Load shapes of U.S. counties (TopoJSON)
	// d3.json("data/world110-m.json", function(error, data) {

	// 	// Convert TopoJSON to GeoJSON (target object = 'states')
	// 	var countries = topojson.feature(data, data.objects.countries).features;

	// 	// Render the U.S. by using the path generator
	// 	svg.selectAll(".country")
	// 		.data(countries)
	// 		.enter().append("path")
	// 		.attr("class", "country")
	// 		.attr("d", path);
	// });

	// console.log(vis.data);
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