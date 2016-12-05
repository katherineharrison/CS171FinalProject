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

	vis.x = d3.time.scale()
		.range([0, vis.width]);


	vis.xAxis = d3.svg.axis()
		.scale(vis.x)
		.orient("top");

	vis.focus = vis.svg.append("g")
        .style("display", "none");

	// vis.xMap = function(d) { return vis.x(d.dateend);};

	vis.svg.append("g")
		.attr("class", "x-axis axis");

	var line = vis.svg.select("g")
		.append("line")
		.attr("class", "line")
		.style("opacity", 0);

	vis.cValue = function(d) { return d.classification;};
	vis.color = d3.scale.category20();

	// draw dots

	// function updateTimeline() {
	// 	var selectBox = document.getElementById("selectBox");
	// 	var selection = selectBox.options[selectBox.selectedIndex].value;
    //
	// 	if (selection == "eighteenth") {
	// 		vis.x.domain([1800, 1899]);
	// 	}
	// };


	// TO DO

	vis.wrangleData();
};

Timeline.prototype.wrangleData = function() {
	var vis = this;

	var selectBox = document.getElementById("selectBox");
	var selection = selectBox.options[selectBox.selectedIndex].value;

	console.log(selection);

		if (selection == "all") {
		vis.displayData = vis.data;

	}
		else if (selection == "nineteen") {
			vis.displayData = vis.data.filter(function(d) {
				return d.dateend > new Date(1800, 0) && d.dateend < new Date(1899, 0);
			});

		}
		else if (selection == "twenty") {
			vis.displayData = vis.data.filter(function(d) {
				return d.dateend > new Date(1900, 0) && d.dateend < new Date(1999, 0);
			});

		}
		else if (selection == "twentyfirst") {
			vis.displayData = vis.data.filter(function (d) {
				return d.dateend > new Date(2000, 0) && d.dateend < new Date(2099, 0);
			});

		}

		var movement = document.getElementById("selectBox2");
		var movementSelect = movement.options[movement.selectedIndex].value;

		console.log(movementSelect);

		if (movementSelect == "mod") {
			vis.displayData = vis.displayData.filter(function(d) {
				return d.division == "Modern and Contemporary Art";
			});
		}
		else if (movementSelect == "euro") {
			vis.displayData = vis.displayData.filter(function(d) {
				return d.division == "European and American Art";
			});
		}
		else if (movementSelect == "asia") {
			vis.displayData = vis.displayData.filter(function(d) {
				return d.division == "Asian and Mediterranean Art";
			});
		}

		vis.x.domain(d3.extent(vis.displayData, function (d) {
			return d.dateend;
		}));

		vis.updateVis();

	// TO DO


};

Timeline.prototype.updateVis = function() {
	var vis = this;

	console.log(vis.displayData.length);

	// Call axis functions with the new domain
	vis.svg.select(".x-axis").call(vis.xAxis);

	var tooltip = d3.select("body").append("div")
		.attr("class", "tooltip")
		.style("opacity", 0);

	var cValue = function(d) { return d.classification;},
		color = d3.scale.category20();

	var formatTime = d3.time.format("%Y");

	vis.svg.selectAll('.dot').data(vis.displayData).exit().remove();

	vis.svg.selectAll(".dot")
		.data(vis.displayData)
		.enter().append("circle")
		.attr("class", "dot")
		.style("opacity", 0.5)
		.attr("r", 6)
		.attr("cx", function(d) {
			return vis.x(d.dateend);
		})
		.attr("cy", function(d) {
			if (d.classification == "Paintings") {
				return 10;
			}
			else if (d.classification == "Prints") {
				return 30;
			}
			else if (d.classification == "Drawings") {
				return 50;
			}
			else if (d.classification == "Photographs") {
				return 70;
			}
			else if (d.classification == "Sculpture") {
				return 90;
			}
			else if (d.classification == "Vessels") {
				return 110;
			}
			else if (d.classification == "Artists' Tools") {
				return 130;
			}
			else if (d.classification == "Multiples") {
				return 150;
			}
			else if (d.classification == "Books") {
				return 170;
			}
			else if (d.classification == "Textile Arts") {
				return 190;
			}
			else if (d.classification == "Medals and Medallions") {
				return 210;
			}
			else if (d.classification == "Furnitures") {
				return 230;
			}
			else {
				return 250;
			}
		})
		.style("fill", function(d) { return vis.color(vis.cValue(d));})
		.on("mouseover", function(d) {
			tooltip.transition()
				.duration(200)
				.style("opacity", .9)
				.style("background", "white");
			tooltip.html(d.title + "<br/>" + formatTime(d.dateend) + " " + d.classification)
				.style("left", (d3.event.pageX + 5) + "px")
				.style("top", (d3.event.pageY - 28) + "px");
		})
		.on("mouseout", function(d) {
			tooltip.transition()
				.duration(500)
				.style("opacity", 0);
		})
		.on("click", function(d){
			// the height is cy 
			console.log(d);

		    vis.focus.append("line")
		        .attr("class", "x")
		        .style("stroke", "black")
				.attr("y1", 0)
				.attr("y2", function() {
					if (d.classification == "Paintings") {
						return 10;
					}
					else if (d.classification == "Prints") {
						return 30;
					}
					else if (d.classification == "Drawings") {
						return 50;
					}
					else if (d.classification == "Photographs") {
						return 70;
					}
					else if (d.classification == "Sculpture") {
						return 90;
					}
					else if (d.classification == "Vessels") {
						return 110;
					}
					else if (d.classification == "Artists' Tools") {
						return 130;
					}
					else if (d.classification == "Multiples") {
							return 80;
					}
					else if (d.classification == "Books") {
						return 150;
					}
					else if (d.classification == "Textile Arts") {
						return 170;
					}
					else if (d.classification == "Medals and Medallions") {
						return 190;
					}
					else if (d.classification == "Furnitures") {
						return 210;
					}
					else {
						return 230;
					}
				})
				.attr("x1", vis.x(d.dateend))
				.attr("x2", vis.x(d.dateend));

			vis.focus.style("display", null);
			// var line = d3.line()
			   //  		.x(function(d) { return cx; })
			   //  		.y(function(d) { return cy; })
			   //  		.style("fill", "black");
			// the height is cy
			// var line = d3.line()
				// .x(function(d) { return cx; })
				// .y(function(d) { return cy; })
				// .style("fill", "black");
		});

	// TO DO
};
