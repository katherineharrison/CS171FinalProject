// old century query string as of 11.14.16
    var century = '&q=century:20th%20century,21st%20century,19th%20century,18th%20century';

// Main JS file
var allData = [];
var mergedData = [];

var map;
var timeline;
var colorVis;

loadData();

function loadData() {
    var proxy = 'http://api.harvardartmuseums.org/object?apikey=9257ca00-a202-11e6-9c4e-5b7c6cef1537';

    var url = '&hasimage=1&size=100&';

    var paintings = '&q=classification:Paintings';

    var numberOfPages;

    $.getJSON(proxy + url + paintings, function(infoData) {
        numberOfPages = infoData.info.pages;

        var data = function() {
            for (i = 1; i < numberOfPages + 1; i++) {
                $.getJSON(proxy + url + 'page=' + i + paintings, function (data) {
                    allData.push(data.records);
                });
            }
            return allData;
        };

        data();
        console.log(allData);
        createVis();
    });

}

function createVis() {

    //TO DO: instantiate visualization
    map = new Map("map", allData);
    timeline = new Timeline("timeline", allData);
    colorVis = new ColorVis("color", allData);

}



