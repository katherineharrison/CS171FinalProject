// Main JS file
var allData = [];
var mergedData = [];

var map;
var timeline;
var colorVis;

loadData();

function loadData() {
    var proxy = 'http://api.harvardartmuseums.org/object?apikey=9257ca00-a202-11e6-9c4e-5b7c6cef1537';

    var url = '&hasimage=1&color=any&title=1&person=any&medium=any&dateend=any&size=100';

    var century = '&q=century:20th%20century,21st%20century,19th%20century,18th%20century';

    var page1 = $.getJSON(proxy + url + '&page=1' + century);
    var page2 = $.getJSON(proxy + url + '&page=2' + century);
    var page3 = $.getJSON(proxy + url + '&page=3' + century);
    var page4 = $.getJSON(proxy + url + '&page=4' + century);
    var page5 = $.getJSON(proxy + url + '&page=5' + century);
    var page6 = $.getJSON(proxy + url + '&page=6' + century);

    $.when(page1, page2, page3, page4, page5, page6)
        .done(function(p1, p2, p3, p4, p5, p6) {

        allData.push(p1[0].records);
        allData.push(p2[0].records);
        allData.push(p3[0].records);
        allData.push(p4[0].records);
        allData.push(p5[0].records);
        allData.push(p6[0].records);

        console.log(allData);

        mergedData = [].concat.apply([], allData);

        console.log(mergedData);

        createVis();
    });

    var places = '&fields=places&size=10000';

    var place = $.getJSON(proxy + century + places);

    $.when(place).done(function(placeData) {
        console.log(placeData.records);
    })


}

function createVis() {

    //TO DO: instantiate visualization
    map = new Map("map", mergedData);
    timeline = new Timeline("timeline", mergedData);
    colorVis = new ColorVis("color", mergedData);

}



