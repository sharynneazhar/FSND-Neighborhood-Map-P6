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
var marker = null;

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
      zoom: (DIMS.width < 662) ? 9 : 10,
      center: new google.maps.LatLng(38.951979, -94.837693),
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
      streetViewControl: false
    };

    map = new google.maps.Map(mapContainer, mapOptions);

    //this.getMarkers(PERSONALS);
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

  // Retrieves marker details and place marker on map
  getMarkers: function(list) {
    $.each(list, function(place, info) {
      marker = new google.maps.Marker({
        title: info.title,
        position: new google.maps.LatLng(
          info.lat,
          info.long
        ),
        map: map,
        animation: google.maps.Animation.DROP
      });
    });
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
        marker = new google.maps.Marker({
          title: 'You Are Here',
          position: new google.maps.LatLng(currentLocation),
          map: map,
          animation: google.maps.Animation.DROP
        });
        map.setCenter(currentLocation);
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
