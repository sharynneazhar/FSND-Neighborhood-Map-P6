/*
  Handles all the services from Google Maps API
  https://developers.google.com/maps/documentation/javascript/
*/

const GMAP_KEY = '?key=AIzaSyCKioYCg26ODl5A4Z2K03OFkXJRT1mBpRk';
const GMAP_BASE_URL = 'http://maps.googleapis.com/maps/';
const GMAP_FULL_URL = GMAP_BASE_URL + 'api/js' + GMAP_KEY + '&libraries=places&callback=GoogleMapsService.init';
const GMAP_QUERY_URL = GMAP_BASE_URL + 'api/place/queryautocomplete/json' + GMAP_KEY + '&input=';

const DIMS = {
  'height': $(window).height(),
  'width': $(window).width()
};

var map = null;
var markers = [];

function loadMapScript() {
  var script = document.createElement('script');
  script.async = true;
  script.type = 'text/javascript';
  script.src = GMAP_FULL_URL;
  document.body.appendChild(script);
}

var GoogleMapsService = {

  // Initializes the map background and markers
  init: function() {
    var mapContainer = document.getElementById('map');
    var mapOptions = {
      zoom: (DIMS.width < 662) ? 10 : 12,
      center: new google.maps.LatLng(39.0997, -94.5786),
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
      streetViewControl: false
    };

    map = new google.maps.Map(mapContainer, mapOptions);
    this.getCurrentLocation();

    // Hide searchbar in streetview
    var streetView = map.getStreetView();
    streetView.addListener('visible_changed', function() {
      if (streetView.getVisible()) {
        $('#searchbar').css('display', 'none');
      } else {
        $('#searchbar').css('display', 'flex');
      }
    });
  },

  getMarkers: function(list) {
    var venue;
    $.each(list, function(place, info) {
      var marker = new google.maps.Marker({
        title: info.title,
        position: new google.maps.LatLng(
          info.lat,
          info.long
        ),
        map: map,
        animation: google.maps.Animation.DROP
      });

      var content = '<div id="venue">'
        + '<div class="venue-name">' + info.title + '</div>'
        + '<div class="venue-url"><a href="' + info.url + '"> ' + info.url + '</a></div>'
        + '<div class="venue-address">' + info.address[0] + '<br>' + info.address[1] + '</div>'
        + '<div class="venue-contact">' + info.contact + '</div>'
        +'</div>';

      var infoWindow = new google.maps.InfoWindow({ content: content });

      marker.addListener('click', function() {
        if (marker.getAnimation() !== null) {
          marker.setAnimation(null);
        } else {
          marker.setAnimation(google.maps.Animation.BOUNCE);
          setTimeout( function() { marker.setAnimation(null); }, 750);
        }
        infoWindow.open(map, marker);
      });

      markers.push(marker);
    });
  },

  showMarkers: function(venues) {
    this.getMarkers(venues);
    var bounds = new google.maps.LatLngBounds();
    $.each(markers, function(index, marker) {
      bounds.extend(marker.getPosition());
      marker.setMap(map);
    });
    // Center the map on visible markers
    map.fitBounds(bounds);
  },

  clearMarkers: function() {
    $.each(markers, function(index, marker) {
      marker.setMap(null);
    });
    markers = [];
  },

  // Retrieves the user's current location
  getCurrentLocation: function() {
    // Use W3C Geolocation (preferred by Google Maps API)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var currentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        var marker = new google.maps.Marker({
          title: 'You Are Here',
          position: new google.maps.LatLng(currentLocation),
          map: map,
          animation: google.maps.Animation.DROP
        });

        // Recenter the map
        if (!map.getBounds().contains(marker.getPosition())) {
          map.panTo(marker.getPosition());
        }

        GoogleMapsService.currentLocation = currentLocation;
      }, function() {
        // TODO Use better error messaging
        console.log('Oops, we were unable to retrieve your current location.');
      });
    } else {
      // TODO Use better error messaging
      console.log('Your browser does not support geolocation.');
    }
  },

};
