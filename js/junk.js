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


