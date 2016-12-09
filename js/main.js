// function onReady(callback) {
//     var intervalID = window.setInterval(checkReady, 1000);
//     function checkReady() {
//         if (document.getElementsByTagName('body')[0] !== undefined) {
//             window.clearInterval(intervalID);
//             callback.call(this);
//         }
//     }
// }

// function show(id, value) {
//     document.getElementById(id).style.display = value ? 'block' : 'none';
// }

// onReady(function () {
//     show('page', true);
//     show('loading', false);
// });

// old century query string as of 11.14.16
var century = '&q=century:20th%20century,21st%20century,19th%20century,18th%20century';

// Main JS file
var allData = [];
var myGallery = [];

var map;
var timeline;
var timeline_brushed;
var gallery;
var red;
var orange;
var yellow;
var green;
var blue;

loadData();
createGallery();

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
    timeline_brushed.wrangleData();
}

function addToGallery(id) {
    var galleryPiece = allData.filter(function(d) {
        return d.id == id;
    });

    myGallery = myGallery.concat(galleryPiece);
    console.log(myGallery);

    function truncate(string){
        if (string.length > 10)
            return string.substring(0,10)+'...';
        else
            return string;
    }

    var gallery = $("#mygallery");
    gallery.append("<li><a><i class='fa fa-fw fa-tag'></i><span class='badge'>"
    + galleryPiece[0].classification + "</span>" + truncate(galleryPiece[0].title) + "</a></li>");

    var count = $("#count");
    var value = myGallery.length;
    count.html(value);

    createGallery();
}

function createVis() {

    allData.forEach(function(d) {
        d.dateend = new Date(d.dateend, 0);
    });

    //TO DO: instantiate visualization
    timeline = new Timeline("timeline", allData);
    timeline_brushed = new Brushed("timeline_brushed", allData);
    red = new ColorVis("Red", allData);
    orange = new ColorVis("Orange", allData);
    yellow = new ColorVis("Yellow", allData);
    green = new ColorVis("Green", allData);
    blue = new ColorVis("Blue", allData);
    map = new Map("map", allData); // put map last since it has the most console.log issues

    updateTimeline();

}

function createGallery() {
    if (myGallery.length > 0) {
        $(".testPopup").magnificPopup({ items: {
            src: '<div class="white-popup"><p>' + myGallery[0].title + '</p><br><p>' +
            myGallery[0].people[0].displayname + '</p></div>',
            image: myGallery[0].images[0].baseimageurl,
            type: 'inline',
            midClick: true
        }
        });
    }
    else {
        $(".testPopup").magnificPopup({ items: {
            src: '<div class="white-popup">You have nothing in your gallery at the moment!</div>',
            type: 'inline',
            midClick: true
        }
        });
    }
}

function brushed() {
    // TO-DO: React to 'brushed' event
    // Set new domain if brush (user selection) is not empty
    timeline_brushed.x.domain(
        timeline.brush.empty() ? timeline.x.domain() : timeline.brush.extent()
    );

    timeline_brushed.wrangleData();
}







