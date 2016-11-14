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
            mergedData = [].concat.apply([], allData[0]);
            console.log(mergedData);
            return allData;
        };

        data();

        console.log(allData);

        console.log(mergedData);
    });

    createVis();
    // });


    // });

    // var places = '&fields=places&size=10000';
    //
    // var place = $.getJSON(proxy + century + places);
    //
    // $.when(place).done(function(placeData) {
    //     console.log(placeData.records);
    // })


}

function createVis() {

    //TO DO: instantiate visualization
    // map = new Map("map", mergedData);
    // timeline = new Timeline("timeline", mergedData);
    // colorVis = new ColorVis("color", mergedData);

}



