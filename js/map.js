// Map Visualization
Map = function(_parentElement, _data, _placeData){
	this.parentElement = _parentElement;
	this.data = _data;
	this.displayData = _data;
	this.placeData = _placeData;

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


vis.map = L.map('map', {maxBounds: L.latLngBounds(L.latLng(-81, -181, true), L.latLng(91, 191, true))});

	// title layer to map
	L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.png', {
		minZoom: 1.5,
		maxZoom: 13
	}).addTo(vis.map);
	// .attr("class", "mapClass")

	vis.map.fitWorld().zoomOut();

	vis.map.on('resize', function(e) {
		map.fitWorld({reset: true}).zoomIn();
	});

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

	// for (var i = 0; i <= 34; i++) {
	// 	$.when(placeList[i]).done(function (p) {
	// 		data = data.concat(p.records);
	// 		if (data.length > 3324) {
	// 			getCoordinates(data);
	// 		}
	// 	});
	// }
    //
	// function getCoordinates(data) {
	// 	data.forEach(function (d) {
	// 		var nameString = d.places[0].displayname;
	// 		nameSting = String(nameString);
	// 		// var pieceInfo = {"name": nameString, "id": d.id};
	// 		// vis.placeData = vis.placeData.concat(pieceInfo);
	// 		$.getJSON(googleAPI + nameString, function (data) {
	// 			var pieceInfo = {"name": nameString, "id": d.id, "location": data.results[0].geometry.location};
	// 			// vis.geoCoord = vis.geoCoord.concat(data.results[0].geometry.location);
	// 			vis.geoCoord = vis.geoCoord.concat(pieceInfo);
	// 			for (var i=0; i<1; i++) {
	// 				var str;
	// 				// How to get the lat and lng objects to print as an array from insite the map.js vis.geoCoord function
	// 				// str = JSON.stringify(vis.geoCoord);
	// 				str = JSON.stringify(vis.geoCoord, null, 4); // (Optional) beautiful indented output.
	// 				console.log(str); // Logs output to dev tools console
	// 				// alert(str); // Displays output using window.alert()
	// 			}
	// 		});
	// 	});
	// }
	
	// bind circles to map
		var svgMap = d3.select("#map").select("svg"),
		g = svgMap.append("g");
		
		d3.json("data/artGeo.json", function(collection) {
			console.log(collection);
			var circles = L.markerClusterGroup();

			collection.forEach(function(d) {
				var id = d.id;

				var circle = L.circleMarker([d.location.lat, d.location.lng], {
					color: "red",
					fillColor: '#f03',
					fillOpacity: 0.5,
					radius: 7
				}).on("click", onClick);

				circle.bindPopup(d.name).openTooltip();

				function onClick() {

					function findPiece(e) {
						var something = vis.data.filter(function(d) {
							return d.id == e;
						});

						return something;
					}

					var object = findPiece(id);
					console.log(object);
					console.log(object[0].title);

					if (object[0].images[0].baseimageurl) {
						swal({title: object[0].title, text: object[0].people[0].displayname,imageUrl: object[0].images[0].baseimageurl});
					}
					else {
						swal({title: object[0].title, text: object[0].people[0].displayname});
					}

				}

				circles.addLayer(circle);

				vis.map.addLayer(circles);
			});

	});

	vis.updateVis();

} // ending bracket for function getCoordinates(data)


Map.prototype.updateVis = function() {
	var vis = this;

	// move bind circles bit to here once we globalize place data 
};

//  This will not end up being the architecture as we
//  we will have to load in a geoJSON, but it'll work for now.