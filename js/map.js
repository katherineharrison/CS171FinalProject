// Map Visualization
Map = function(_parentElement, _data){
	this.parentElement = _parentElement;
	this.data = _data;
	this.displayData = _data;
	this.placeData = [];

	this.initVis();
};

Map.prototype.initVis = function() {
	var vis = this;

	console.log(vis.data.length);

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


var map = L.map('map').setView([14.5994, 28.6731], 2);

	// title layer to map
	L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.png', {
		minZoom: 2,
		maxZoom: 16
	}).addTo(map);
	// .attr("class", "mapClass")

	map.append().translate(0,100);

	// read this to gix dragging http://leafletjs.com/reference.html#map-dragging

	// change map color on hover 
	map.on('mouseover', function() {
    this.setStyle({
        color: 'red'   //or whatever style you wish to use;
    	});
	});

	map.on('mouseout', function() {
    	this.setStyle(initialStyle)
	});


	 /* Old Map code 
	// Load shapes of U.S. counties (TopoJSON)
	d3.json("data/world110-m.json", function(error, data) {

		// Convert TopoJSON to GeoJSON (target object = 'states')
		var countries = topojson.feature(data, data.objects.countries).features;

		// Render the U.S. by using the path generator
		svg.selectAll(".country")
			.data(countries)
			.enter().append("path")
			.attr("class", "country")
			.attr("d", path);
	});

	console.log(vis.data);
	TO DO
	*/
	

	vis.wrangleData();

};

Map.prototype.wrangleData = function() {
	var vis = this;

	var proxy = 'http://api.harvardartmuseums.org/object?apikey=9257ca00-a202-11e6-9c4e-5b7c6cef1537';

	var url = '&hasimage=1&color=any&title=*&person=any&medium=any&size=100';

	var century = '&yearmade=1800-2100&century=any';

	var places = '&place=any&fields=places';

	var placeList = [];

	var data = [];

	vis.geoCoord = [];

	var googleAPI = 'https://maps.googleapis.com/maps/api/geocode/json?address=';

	function createPlaces() {
		for (var i = 0; i <= 34; i++) {
			placeList[i] = $.getJSON(proxy + url + '&page=' + (i + 1) + century + places);
		}

		return placeList;
	}

	createPlaces();

	for (var i = 0; i <= 34; i++) {
		$.when(placeList[i]).done(function (p) {
			data = data.concat(p.records);
			if (data.length > 3324) {
				getCoordinates(data);
			}
		});
	}

	function getCoordinates(data) {
		data.forEach(function (d) {
			var nameString = d.places[0].displayname;
			nameSting = String(nameString);
			$.getJSON(googleAPI + nameString, function(data) {
				vis.geoCoord = vis.geoCoord.concat(data.results[0].geometry.location);
				if (vis.geoCoord.length > 3323) {
					// console.log(vis.geoCoord[0].lat);
					// console.log(vis.geoCoord);
					vis.placeData = vis.geoCoord;
				}
			});
		});
	
	// bind circles to map
		var svgMap = d3.select("#map").select("svg"),
		g = svgMap.append("g");
		
		// d3.json("artGeo.json", function(collection) {
		// 	/* Add a LatLng object to each item in the dataset */
		// 	collection.objects.forEach(function(d) {
		// 		d.LatLng = new L.LatLng(d.circle.coordinates[0],
		// 								d.circle.coordinates[1])
		// 	})
			
		// 	var feature = g.selectAll("circle")
		// 		.data(collection.objects)
		// 		.enter().append("circle")
		// 		.style("stroke", "black")  
		// 		.style("opacity", .6) 
		// 		.style("fill", "red")
		// 		.attr("r", 20);  
		// 	});



	} // ending bracket for funcation getCoordinates(data)

	vis.updateVis();
}

Map.prototype.updateVis = function() {
	var vis = this;

	console.log(vis.placeData);

	// move bind circles bit to here once we globalize place data 
};

//  This will not end up being the architecture as we
//  we will have to load in a geoJSON, but it'll work for now.