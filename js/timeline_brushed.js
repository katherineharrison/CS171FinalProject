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
