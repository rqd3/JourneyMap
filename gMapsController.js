var map;

/**
@Param markerPositions = Array[latitude][longitude]
*/
function addMarkers(photoPositions) {
    var infoBox;
    var infowindow;

    for (i = 0; i < photoPositions[0].length; i++) {
        infoBox = '<div id="infoBox"><h2>Test</h2></br><img src="http://i.stack.imgur.com/pZwf4.png" width="123"/> </div>'

        infowindow = new google.maps.InfoWindow({
            content: infoBox
        });

        marker = new google.maps.Marker({
            map: map,
            draggable: false,
            position: new google.maps.LatLng(photoPositions[0][i], photoPositions[1][i]),
            infowindow: infowindow
        });

        google.maps.event.addListener(marker, 'click', function () {
            infowindow.open(map, this);
        });
    }
}

function initialize() {
    var mapOptions = {
        zoom: 2,
        center: new google.maps.LatLng(44.984122, -18.967268)
    };
    map = new google.maps.Map(document.getElementById('gMaps'), mapOptions);
}

google.maps.event.addDomListener(window, 'load', initialize);