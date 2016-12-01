function onReady(callback) {
    var intervalID = window.setInterval(checkReady, 1000);
    function checkReady() {
        if (document.getElementsByTagName('body')[0] !== undefined) {
            window.clearInterval(intervalID);
            callback.call(this);
        }
    }
}

function show(id, value) {
    document.getElementById(id).style.display = value ? 'block' : 'none';
}

onReady(function () {
    show('page', true);
    show('loading', false);
});

// old century query string as of 11.14.16
var century = '&q=century:20th%20century,21st%20century,19th%20century,18th%20century';

// Main JS file
var allData = [];
var placeData = [];

var map;
var timeline;
var colorVis;

loadData();

function loadData() {
    var proxy = 'http://api.harvardartmuseums.org/object?apikey=9257ca00-a202-11e6-9c4e-5b7c6cef1537';

    var url = '&hasimage=1&color=any&title=*&person=any&medium=any&size=100';

    var century = '&yearmade=1800-2100&century=any';

    var list = [];

    d3.json("data/artGeo.json", function(collection) {
        console.log(collection);
    });


    function createPages() {
        for (var i = 0; i <= 59; i++) {
          list[i] = $.getJSON(proxy + url + '&page=' + (i + 1) + century);
        }

        return list;
    }

    createPages();

    for (var i = 0; i <= 59; i++) {
        $.when(list[i]).done(function(p) {
            allData = allData.concat(p.records);
            if (allData.length > 5999) {
                createVis();
            }
        });
    }

}

function updateTimeline() {
    timeline.wrangleData();
}

function createVis() {

    allData.forEach(function(d) {
        d.dateend = new Date(d.dateend, 0);
    });

    //TO DO: instantiate visualization
    timeline = new Timeline("timeline", allData);
    colorVis = new ColorVis("color", allData);
    map = new Map("map", allData); // put map last since it has the most console.log issues

    updateTimeline();

}





