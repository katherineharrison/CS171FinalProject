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
