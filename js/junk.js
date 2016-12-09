  // Color Visual with image access
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
             .attr("height", "200")
             .attr("width", "100")
             .style("overflow", "hidden")
             .style("position", "absolute");

        // Fisheye distortion code
(function() {
  d3.fisheye = {
    scale: function(scaleType) {
          return d3_fisheye_scale(scaleType(), 3, 0);
      },
    ordinal: function() {
        return d3_fisheye_scale_ordinal(d3.scale.ordinal(), 3, 0)
    },
    circular: function() {
        var radius = 200,
            distortion = 2,
            k0,
            k1,
            focus = [0, 0];

        function fisheye(d) {
            var dx = d.x - focus[0],
                dy = d.y - focus[1],
                dd = Math.sqrt(dx * dx + dy * dy);
            if (!dd || dd >= radius) return {x: d.x, y: d.y, z: 1};
            var k = k0 * (1 - Math.exp(-dd * k1)) / dd * .75 + .25;
            return {x: focus[0] + dx * k, y: focus[1] + dy * k, z: Math.min(k, 10)};
        }

        function rescale() {
            k0 = Math.exp(distortion);
            k0 = k0 / (k0 - 1) * radius;
            k1 = distortion / radius;
            return fisheye;
        }

        fisheye.radius = function(_) {
            if (!arguments.length) return radius;
            radius = +_;
            return rescale();
        };

        fisheye.distortion = function(_) {
            if (!arguments.length) return distortion;
            distortion = +_;
            return rescale();
        };

        fisheye.focus = function(_) {
            if (!arguments.length) return focus;
            focus = _;
            return fisheye;
        };

        return rescale();
    },
  };

    function d3_fisheye_scale(scale, d, a) {

      function fisheye(_) {
          var x = scale(_),
              left = x < a,
              range = d3.extent(scale.range()),
              min = range[0],
              max = range[1],
              m = left ? a - min : max - a;
          if (m == 0) m = max - min;
          return (left ? -1 : 1) * m * (d + 1) / (d + (m / Math.abs(x - a))) + a;
      }

      fisheye.distortion = function (_) {
          if (!arguments.length) return d;
          d = +_;
          return fisheye;
      };

      fisheye.focus = function (_) {
          if (!arguments.length) return a;
          a = +_;
          return fisheye;
      };

      fisheye.copy = function () {
          return d3_fisheye_scale(scale.copy(), d, a);
      };

      fisheye.nice = scale.nice;
      fisheye.ticks = scale.ticks;
      fisheye.tickFormat = scale.tickFormat;
      return d3.rebind(fisheye, scale, "domain", "range");
    };

    function d3_fisheye_scale_ordinal(scale, d, a) {

        function scale_factor(x) {
            var 
                left = x < a,
                range = scale.rangeExtent(),
                min = range[0],
                max = range[1],
                m = left ? a - min : max - a;

            if (m == 0) m = max - min;
            var factor = (left ? -1 : 1) * m * (d + 1) / (d + (m / Math.abs(x - a)));
            return factor + a;
        };

        function fisheye(_) {
            return scale_factor(scale(_));
        };

        fisheye.distortion = function (_) {
            if (!arguments.length) return d;
            d = +_;
            return fisheye;
        };

        fisheye.focus = function (_) {
            if (!arguments.length) return a;
            a = +_;
            return fisheye;
        };

        fisheye.copy = function () {
            return d3_fisheye_scale_ordinal(scale.copy(), d, a);
        };

        fisheye.rangeBand = function (_) {
            var band = scale.rangeBand(),
                x = scale(_),
                x1 = scale_factor(x),
                x2 = scale_factor(x + band);

            return Math.abs(x2 - x1);
        };

       
        fisheye.rangeRoundBands = function (x, padding, outerPadding) {
            var roundBands = arguments.length === 3 ? scale.rangeRoundBands(x, padding, outerPadding) : arguments.length === 2 ? scale.rangeRoundBands(x, padding) : scale.rangeRoundBands(x);
            fisheye.padding = padding * scale.rangeBand();
            fisheye.outerPadding = outerPadding;
            return fisheye;
        };

        return d3.rebind(fisheye, scale, "domain",  "rangeExtent", "range");
    };
        
})();

var w = 960,
h = 500,
p = [20, 50, 30, 20];

//fisheye distortion scale
x = d3.fisheye.ordinal().rangeRoundBands([0, w - p[1] - p[3]]).distortion(0.9),
x.domain([0,2000]);

var svg = d3.select("body").append("svg:svg")
.attr("width", w)
.attr("height", h)
.append("svg:g")
.attr("transform", "translate(" + p[3] + "," + (h - p[2]) + ")");

var cause = svg.selectAll("g.cause")
.data(vis.filtered)
.enter().append("svg:g")
.attr("class", "cause")
.style("fill", "blue")
.style("stroke", "red");

// Add a rect for each date.
var rect = svg.selectAll("rect")
.data(vis.filtered)
.enter().append("svg:rect")
.attr("x", function(d, index) {
          return x(index * 5);
        })
.attr("y", "0")
.attr("height", "350")
.attr("width", function(d, index) {
  return x.rangeBand(index * 5);
});

svg.on("mousemove", function() {
    var mouse = d3.mouse(this);
    
    //refocus the distortion
    x.focus(mouse[0]);
    //redraw the bars
    rect
    .attr("x", function(d, index) { return x(index * 5); })
    .attr("y", "0")
    .attr("width", function(d, index) {return x.rangeBand(index * 5);});
   
});

Original timeline_brushed:

/**
 * Created by mariamclaughlin on 12/5/16.
 */
// Timeline Visualization
Brushed = function(_parentElement, _data){
    this.parentElement = _parentElement;
    this.data = _data;
    this.displayData = _data;

    this.initVis();
};

Brushed.prototype.initVis = function() {
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
        .range([0, vis.width])
        .domain(d3.extent(vis.data, function(d) { return d.dateend; }));

    vis.y = d3.scale.ordinal()
        .domain(["Paintings", "Prints", "Drawings", "Photographs",  "Sculpture", "Vessels", "Artists' Tools", "Multiples",
            "Books", "Textile Arts", "Medals and Medallions", "Furniture", "Other"])
        .rangePoints([10, vis.height]);

    vis.yAxis = d3.svg.axis()
        .scale(vis.y)
        .orient("left");

    vis.xAxis = d3.svg.axis()
        .scale(vis.x)
        .orient("top");

    vis.svg.append("g")
        .attr("class", "x-axis axis");

    vis.svg.append("g")
        .attr("class", "y-axis axis")
        .attr("transform", "translate(10, 0)");

    vis.svg.select(".x-axis").call(vis.xAxis);
    vis.svg.select(".y-axis").call(vis.yAxis);

    vis.g = vis.svg.append('g')
         .attr('transform', 'translate(32,32)');

    // vis.circles = vis.g.append('g');
    //
    // vis.dots = vis.circles.selectAll(".dot").data(vis.data);

    vis.circles = vis.svg.selectAll('.dot').data(vis.displayData);

    vis.wrangleData();
};

Brushed.prototype.wrangleData = function() {
    var vis = this;

    vis.displayData = vis.data;
    // TO DO

    vis.updateVis();
};



Brushed.prototype.updateVis = function() {
    var vis = this;

    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    var formatTime = d3.time.format("%Y");

    var cValue = function(d) { return d.classification;},
        color = d3.scale.category20();

    vis.dots = vis.svg.selectAll('.dot').data(vis.displayData);

    vis.dots.enter()
        .append("circle")
        .style("opacity", 0.5)
        .attr("r", 4)
        .attr("cx", function(d) {
            return vis.x(d.dateend);
        })
        .attr("cy", function(d) {
            if (d.classification == "Paintings") {
                return 10;
            }
            else if (d.classification == "Prints") {
                return 20;
            }
            else if (d.classification == "Drawings") {
                return 30;
            }
            else if (d.classification == "Photographs") {
                return 40;
            }
            else if (d.classification == "Sculpture") {
                return 50;
            }
            else if (d.classification == "Vessels") {
                return 60;
            }
            else if (d.classification == "Artists' Tools") {
                return 70;
            }
            else if (d.classification == "Multiples") {
                return 80;
            }
            else if (d.classification == "Books") {
                return 90;
            }
            else if (d.classification == "Textile Arts") {
                return 100;
            }
            else if (d.classification == "Medals and Medallions") {
                return 110;
            }
            else if (d.classification == "Furnitures") {
                return 120;
            }
            else {
                return 130;
            }
        })
        .style("fill", function(d) {
            return color(cValue(d));
        })
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
        .on("click", function(d) {
            // the height is cy

            vis.svg.select("line").remove();

            vis.focus.append("line")
                .attr("class", "line")
                .style("stroke", "black")
                .attr("y1", 0)
                .attr("y2", function () {
                    if (d.classification == "Paintings") {
                        return 10;
                    }
                    else if (d.classification == "Prints") {
                        return 20;
                    }
                    else if (d.classification == "Drawings") {
                        return 30;
                    }
                    else if (d.classification == "Photographs") {
                        return 40;
                    }
                    else if (d.classification == "Sculpture") {
                        return 50;
                    }
                    else if (d.classification == "Vessels") {
                        return 60;
                    }
                    else if (d.classification == "Artists' Tools") {
                        return 70;
                    }
                    else if (d.classification == "Multiples") {
                        return 80;
                    }
                    else if (d.classification == "Books") {
                        return 90;
                    }
                    else if (d.classification == "Textile Arts") {
                        return 100;
                    }
                    else if (d.classification == "Medals and Medallions") {
                        return 110;
                    }
                    else if (d.classification == "Furnitures") {
                        return 120;
                    }
                    else {
                        return 130;
                    }
                })
                .attr("x1", vis.x(d.dateend))
                .attr("x2", vis.x(d.dateend))
        });

    vis.dots.exit().remove();

    // Call axis functions with the new domain
    vis.svg.select(".x-axis").call(vis.xAxis);
    vis.svg.select(".y-axis").call(vis.yAxis);

};

// POSSIBLE ADDITION OF FISHEYE FOCUS TO TIMELINE
/**
 * Created by mariamclaughlin on 12/5/16.
 */
// Top Timeline Visualization that results from the brushing of the bottom timeline visualization
Brushed = function(_parentElement, _data){
    this.parentElement = _parentElement;
    this.data = _data;
    this.displayData = _data;

    this.initVis();
};

Brushed.prototype.initVis = function() {
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
        .range([0, vis.width])
        .domain(d3.extent(vis.data, function(d) { return d.dateend; }));

    vis.y = d3.scale.linear()
        .domain([10, 130])
        .range([10, vis.height - 30]);

    vis.names = d3.scale.ordinal()
        .domain(["Paintings", "Prints", "Drawings", "Photographs",  "Sculpture", "Vessels", "Artists' Tools", "Multiples",
            "Books", "Textile Arts", "Medallions", "Furniture", "Other"])
        .rangeRoundBands([10, vis.height]);

    vis.yAxis = d3.svg.axis()
        .scale(vis.names)
        .orient("left");

    vis.xAxis = d3.svg.axis()
        .scale(vis.x)
        .orient("top");

    vis.svg.append("g")
        .attr("class", "x-axis axis")
        .attr("transform", "translate(29, 35)");

    vis.svg.append("g")
        .attr("class", "y-axis axis")
        .attr("transform", "translate(29, 25)");

    vis.svg.select(".x-axis").call(vis.xAxis);
    vis.svg.select(".y-axis").call(vis.yAxis);

    vis.g = vis.svg.append('g')
         .attr('transform', 'translate(32, 32)');

    vis.circles = vis.g.append('g')
        .attr("transform", "translate(0, 5)");

    vis.dots = vis.circles.selectAll(".dot").data(vis.data);

    vis.cValue = function(d) { return d.classification;};
    vis.color = d3.scale.category20();

    vis.wrangleData();
};

Brushed.prototype.wrangleData = function() {
    var vis = this;

    vis.displayData = vis.data;
    // TO DO
    var selectBox = document.getElementById("selectBoxMedium");
    var selection = selectBox.options[selectBox.selectedIndex].value;

    console.log(selection);

    vis.displayData = vis.data;

            if (selection == "all") {
                vis.displayData = vis.data;
            }
            else if (selection == "Paintings") {
                vis.svg.select("line").remove();
                vis.displayData = vis.displayData.filter(function(d) {
                    return d.classification == "Paintings";
                });    
            }
            else if (selection == "Prints") {
                vis.svg.select("line").remove();
                vis.displayData = vis.displayData.filter(function(d) {
                    return d.classification == "Prints";
                }); 
            }
            else if (selection == "Drawings") {
                vis.svg.select("line").remove();
                vis.displayData = vis.displayData.filter(function(d) {
                    return d.classification == "Drawings";
                }); 
            }
            else if (selection == "Photographs") {
                vis.svg.select("line").remove();
                vis.displayData = vis.displayData.filter(function(d) {
                    return d.classification == "Photographs";
                }); 
            }
            else if (selection == "Sculpture") {
                vis.svg.select("line").remove();
                vis.displayData = vis.displayData.filter(function(d) {
                    return d.classification == "Sculpture";
                }); 
            }
            else if (selection == "Vessels") {
                vis.svg.select("line").remove();
                vis.displayData = vis.displayData.filter(function(d) {
                    return d.classification == "Vessels";
                }); 
            }
            else if (selection == "Artists' Tools") {
                vis.svg.select("line").remove();
                vis.displayData = vis.displayData.filter(function(d) {
                    return d.classification == "Artists' Tools";
                }); 
            }
            else if (selection == "Multiples") {
                vis.svg.select("line").remove();
                vis.displayData = vis.displayData.filter(function(d) {
                    return d.classification == "Multiples";
                }); 
            }
            else if (selection == "Books") {
                vis.svg.select("line").remove();
                vis.displayData = vis.displayData.filter(function(d) {
                    return d.classification == "Books";
                }); 
            }
            else if (selection == "Textile Arts") {
                vis.svg.select("line").remove();
                vis.displayData = vis.displayData.filter(function(d) {
                    return d.classification == "Textile Arts";
                }); 
            }
            else if (selection == "Medals and Medallions") {
                vis.svg.select("line").remove();
                vis.displayData = vis.displayData.filter(function(d) {
                    return d.classification == "Medals and Medallions";
                }); 
            }
            else if (selection == "Furnitures") {
                vis.svg.select("line").remove();
                vis.displayData = vis.displayData.filter(function(d) {
                    return d.classification == "Furnitures";
                }); 
            }
            else {
                vis.svg.select("line").remove();
                vis.displayData = vis.displayData.filter(function(d) {
                    return d.classification == "Other";
                }); 
            }

    vis.updateVis();
};



Brushed.prototype.updateVis = function() {
    var vis = this;

    (function() {
  d3.fisheye = {
    scale: function(scaleType) {
          return d3_fisheye_scale(scaleType(), 3, 0);
      },
    ordinal: function() {
        return d3_fisheye_scale_ordinal(d3.scale.ordinal(), 3, 0)
    },
    circular: function() {
        var radius = 200,
            distortion = 2,
            k0,
            k1,
            focus = [0, 0];

        function fisheye(d) {
            var dx = d.x - focus[0],
                dy = d.y - focus[1],
                dd = Math.sqrt(dx * dx + dy * dy);
            if (!dd || dd >= radius) return {x: d.x, y: d.y, z: 1};
            var k = k0 * (1 - Math.exp(-dd * k1)) / dd * .75 + .25;
            return {x: focus[0] + dx * k, y: focus[1] + dy * k, z: Math.min(k, 10)};
        }

        function rescale() {
            k0 = Math.exp(distortion);
            k0 = k0 / (k0 - 1) * radius;
            k1 = distortion / radius;
            return fisheye;
        }

        fisheye.radius = function(_) {
            if (!arguments.length) return radius;
            radius = +_;
            return rescale();
        };

        fisheye.distortion = function(_) {
            if (!arguments.length) return distortion;
            distortion = +_;
            return rescale();
        };

        fisheye.focus = function(_) {
            if (!arguments.length) return focus;
            focus = _;
            return fisheye;
        };

        return rescale();
    },
  };

    function d3_fisheye_scale(scale, d, a) {

      function fisheye(_) {
          var x = scale(_),
              left = x < a,
              range = d3.extent(scale.range()),
              min = range[0],
              max = range[1],
              m = left ? a - min : max - a;
          if (m == 0) m = max - min;
          return (left ? -1 : 1) * m * (d + 1) / (d + (m / Math.abs(x - a))) + a;
      }

      fisheye.distortion = function (_) {
          if (!arguments.length) return d;
          d = +_;
          return fisheye;
      };

      fisheye.focus = function (_) {
          if (!arguments.length) return a;
          a = +_;
          return fisheye;
      };

      fisheye.copy = function () {
          return d3_fisheye_scale(scale.copy(), d, a);
      };

      fisheye.nice = scale.nice;
      fisheye.ticks = scale.ticks;
      fisheye.tickFormat = scale.tickFormat;
      return d3.rebind(fisheye, scale, "domain", "range");
    };

    function d3_fisheye_scale_ordinal(scale, d, a) {

        function scale_factor(x) {
            var 
                left = x < a,
                range = scale.rangeExtent(),
                min = range[0],
                max = range[1],
                m = left ? a - min : max - a;

            if (m == 0) m = max - min;
            var factor = (left ? -1 : 1) * m * (d + 1) / (d + (m / Math.abs(x - a)));
            return factor + a;
        };

        function fisheye(_) {
            return scale_factor(scale(_));
        };

        fisheye.distortion = function (_) {
            if (!arguments.length) return d;
            d = +_;
            return fisheye;
        };

        fisheye.focus = function (_) {
            if (!arguments.length) return a;
            a = +_;
            return fisheye;
        };

        fisheye.copy = function () {
            return d3_fisheye_scale_ordinal(scale.copy(), d, a);
        };

        fisheye.rangeBand = function (_) {
            var band = scale.rangeBand(),
                x = scale(_),
                x1 = scale_factor(x),
                x2 = scale_factor(x + band);

            return Math.abs(x2 - x1);
        };

       
        fisheye.rangeRoundBands = function (x, padding, outerPadding) {
            var roundBands = arguments.length === 3 ? scale.rangeRoundBands(x, padding, outerPadding) : arguments.length === 2 ? scale.rangeRoundBands(x, padding) : scale.rangeRoundBands(x);
            fisheye.padding = padding * scale.rangeBand();
            fisheye.outerPadding = outerPadding;
            return fisheye;
        };

        return d3.rebind(fisheye, scale, "domain",  "rangeExtent", "range");
    };
        
})();

vis.x = d3.fisheye.scale(d3.time.scale).range([0, vis.width])
        .domain(d3.extent(vis.data, function(d) { return d.dateend; })).focus(vis.width/2);

    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    var formatTime = d3.time.format("%Y");

    var cValue = function(d) { return d.classification;},
        color = d3.scale.category20();

    vis.dot = vis.circles.selectAll('.dot').data(vis.displayData);

    vis.dot.enter().append("circle").attr("class", "dot");

    vis.dot.exit().remove();

    vis.dot.style("opacity", 0.5)
        .attr("r", 4)
        .attr("cx", function(d) {
            return vis.x(d.dateend);
        })
        .attr("cy", function(d) {
            if (d.classification == "Paintings") {
                return vis.y(10);
            }
            else if (d.classification == "Prints") {
                return vis.y(20);
            }
            else if (d.classification == "Drawings") {
                return vis.y(30);
            }
            else if (d.classification == "Photographs") {
                return vis.y(40);
            }
            else if (d.classification == "Sculpture") {
                return vis.y(50);
            }
            else if (d.classification == "Vessels") {
                return vis.y(60);
            }
            else if (d.classification == "Artists' Tools") {
                return vis.y(70);
            }
            else if (d.classification == "Multiples") {
                return vis.y(80);
            }
            else if (d.classification == "Books") {
                return vis.y(90);
            }
            else if (d.classification == "Textile Arts") {
                return vis.y(100);
            }
            else if (d.classification == "Medals and Medallions") {
                return vis.y(110);
            }
            else if (d.classification == "Furnitures") {
                return vis.y(120);
            }
            else {
                return vis.y(130);
            }
        })
        .style("fill", function(d) {
            return vis.color(vis.cValue(d));
        })
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
        .on("click", function(d) {
            // the height is cy
            console.log(d.datebegin);

            if (d != null){
                console.log(d.division);

                                var objectContent = "<table><tr><th>Artist: </th><td class='alnleft'>" + d.people[0].displayname 
                                    + "</td></tr><tr><th>Year: </th><td class='alnleft'>" + d.datebegin 
                                    + "</td></tr><tr><th>Medium: </th><td class='alnleft'>" + d.classification
                                    + "</td></tr><tr><th>Category: </th><td class='alnleft'>" + d.division
                                    + "</td></tr></tr></table>";

                            if (d.images.length > 0){
                                swal({
                                    title: d.title,
                                    text:  objectContent,
                                    // "Artist: " object[0].people[0].displayname ,
                                    imageUrl: d.images[0].baseimageurl,
                                    html: true,
                                    showCancelButton: true,
                                    confirmButtonColor: "#8CD4F5",
                                    confirmButtonText: "Add to Gallery",
                                    cancelButtonText: "Cancel",
                                    closeOnConfirm: false
                                },
                                    function(){
                                        addToGallery(d.id);
                                        swal("Added to Gallery!", "This piece has been added to your gallery.", "success");
                                    });
                            }

                            else{
                                swal({
                                    title: d.title,
                                    text: objectContent,
                                    imageUrl: "img/noimage.jpg",
                                    html: true,
                                    showCancelButton: true,
                                    confirmButtonColor: "#8CD4F5",
                                    confirmButtonText: "Add to Gallery",
                                    cancelButtonText: "Cancel",
                                    closeOnConfirm: false
                                },
                                    function(){
                                        addToGallery(d.id);
                                        swal("Added to Gallery!", "This piece has been added to your gallery.", "success");
                                    });
                            }
                        }

                        if(d.length == 0){
                            swal({
                                title: "Sorry! No info to display.",
                                imageUrl: "img/noimage.jpg"
                            });
                        }
        })
    .call(position);

    function position(dot) {
        dot.attr("cx", function(d, index) {
            return vis.x(index);
        });
        dot.attr("r", function(d, index) {
            return 4;
        })
    }

    vis.svg.on("mousemove", function() {
        var mouse = d3.mouse(this);
        vis.x.distortion(2).focus(mouse[0]);

        vis.dot.call(position);
    });

    // Define the clipping region
    vis.svg.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", vis.width)
        .attr("height", vis.height);

    vis.circles
        .datum(vis.displayData)
        .attr("d", vis.dot)
        .attr("clip-path", "url(#clip)");

    // Call axis functions with the new domain
    vis.svg.select(".x-axis").call(vis.xAxis);
    vis.svg.select(".y-axis").call(vis.yAxis);

};

FINAL Color
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
    vis.margin = { top: 0, right: 60, bottom: 60, left: 20 };

    vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right,
        vis.height = 350 - vis.margin.top - vis.margin.bottom;

    vis.tooltip = d3.select("#" + vis.parentElement).append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    vis.wrangleColorData();
};

ColorVis.prototype.wrangleColorData = function() {
    var vis = this;

  // var slider = d3.slider().axis(true).min(2000).max(2100).step(5);

  // vis.svg.append(slider);

  function convertHex(hex) {
    if (hex.length > 2) {
      result = [0, 0, 0];
      return result;
    }
    else {
      hex = hex.replace('#','');
      r = parseInt(hex.substring(0,2), 16);
      g = parseInt(hex.substring(2,4), 16);
      b = parseInt(hex.substring(4,6), 16);

      result = [r, g, b];
      return result;
    }
  }

  function rgbToHsl(r, g, b) {
    r /= 255, g /= 255, b /= 255;

    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if (max == min) {
      h = s = 0; // achromatic
    } else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }

      h /= 6;
    }

    return [ h, s, l ];
  }

  vis.displayData = vis.data;

  vis.cleaned = vis.displayData;

  // vis.cleaned.forEach(function(d) {
  //   var colorObjects = d.colors;
  //   for (i = 0; i < colorObjects.length; i++) {
  //       console.log(d.colors[i].color);
  //       d.colors[i].color = d.colors[i].color;
  //   }
  // });

  // console.log(vis.cleaned);

  vis.cleaned.forEach(function(d) {
    var colorObjects = d.colors;
    for (i = 0; i < colorObjects.length; i++) {
      console.log(d.colors[i].css3);
        var rgb = convertHex(d.colors[i].css3);
        var hsl = rgbToHsl(rgb[0],rgb[1],rgb[2]);
        d.colors[i].color = [d.colors[i].color,hsl];
      }
  });

    vis.col = vis.cleaned.filter(function(d) {
        var colorObjects = d.colors;
        for (i = 0; i < colorObjects.length; i++) {
            if (d.colors[i].hue == vis.parentElement) {
                return d;
            }
        }
    });

  vis.col.sort(function(a,b) {
    var c1 = a.colors;
    var c2 = b.colors;
    for (i = 0; i < c1.length; i++) {
      if (a.colors[i].hue == vis.parentElement) {
        for (j = 0; j < c2.length; j++) {
          if (b.colors[j].hue == vis.parentElement) {
            console.log(a.colors[i].color[1][2]);
            return (a.colors[i].color[1][2] - b.colors[j].color[1][2]);
          }
        }
      }
    }
  });

    vis.filtered = vis.col.filter(function(d) {
        if (d.classification == "Paintings" || d.classification == "Drawings") {
            return d;
        }
    });

    vis.updateVis();    
};











