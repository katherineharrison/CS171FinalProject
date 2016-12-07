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



