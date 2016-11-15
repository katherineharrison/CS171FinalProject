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

    var url = '&hasimage=1&color=any&title=*&person=any&medium=any&size=100';

    var century = '&yearmade=1800-2100&century=any';

    var list = [];

    function createPages() {
        for (var i = 0; i <= 59; i++) {
          list[i] = $.getJSON(proxy + url + '&page=' + (i + 1) + century);
        }

        return list;
    }

    createPages();
    console.log(list);

    for (var i = 0; i <= 59; i++) {
        $.when(list[i]).done(function(p) {
            allData = allData.concat(p.records);
            if (allData.length > 5999) {
                createVis();
            }
        });
    }

    var places = '&fields=places&size=10000';

    var place = $.getJSON(proxy + century + places);

    $.when(place).done(function(placeData) {
        console.log(placeData.records);
    })

}

function createVis() {

    //TO DO: instantiate visualization
    map = new Map("map", allData);
    timeline = new Timeline("timeline", allData);
    colorVis = new ColorVis("color", allData);

}




