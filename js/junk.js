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

    var page1 = $.getJSON(proxy + url + '&page=1' + century);
    var page2 = $.getJSON(proxy + url + '&page=2' + century);
    var page3 = $.getJSON(proxy + url + '&page=3' + century);
    var page4 = $.getJSON(proxy + url + '&page=4' + century);
    var page5 = $.getJSON(proxy + url + '&page=5' + century);
    var page6 = $.getJSON(proxy + url + '&page=6' + century);
    var page7 = $.getJSON(proxy + url + '&page=7' + century);
    var page8 = $.getJSON(proxy + url + '&page=8' + century);
    var page9 = $.getJSON(proxy + url + '&page=9' + century);
    var page10 = $.getJSON(proxy + url + '&page=10' + century);
    var page11 = $.getJSON(proxy + url + '&page=11' + century);
    var page12 = $.getJSON(proxy + url + '&page=12' + century);
    console.log(page12);

    $.when(page1, page2, page3, page4, page5, page6, page7, page8, page9, page10, page11, page12)
        .done(function(p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12) {

        console.log(p12[0]);
        allData.push(p1[0].records);
        allData.push(p2[0].records);
        allData.push(p3[0].records);
        allData.push(p4[0].records);
        allData.push(p5[0].records);
        allData.push(p6[0].records);
        allData.push(p7[0].records);
        allData.push(p8[0].records);
        allData.push(p9[0].records);
        allData.push(p10[0].records);
        allData.push(p11[0].records);
        allData.push(p12[0].records);

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



