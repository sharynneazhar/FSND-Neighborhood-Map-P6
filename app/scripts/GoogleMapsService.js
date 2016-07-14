/*
  Handles all the services from Google Maps API
  https://developers.google.com/maps/documentation/javascript/
*/

var map;
var marker;

function loadMapScript() {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.src = GOOGLE_MAP_URL
    + GOOGLE_MAP_KEY
    + '&libraries=places&callback=GoogleService.init';
  document.body.appendChild(script);
}

var GoogleService = {

  // Initializes the map background and markers
  init: function() {
    var mapOptions = {
      zoom: 10,
      center: new google.maps.LatLng(38.951979, -94.837693),
      mapTypeControl: false,
    };

    if (DIMS.width < 662) {
      mapOptions.zoom = 8;
    }

    map = new google.maps.Map(
      document.getElementById('map'), mapOptions
    );

    this.getPersonalMarkers();

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

  getPersonalMarkers: function() {
    $.each(PERSONALS, function(place, info) {
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

  getLocation: function(location) {
    var geocoder = new google.maps.Geocoder();
    var query = GOOGLE_MAP_QUERY + location;
    $.getJSON(query, function(data) {
      $.each(data.predictions, function(place, info) {
        geocoder.geocode({'placeId': info.place_id}, function(results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
            map.setCenter(results[0].geometry.location);
            marker = new google.maps.Marker({
              map: map,
              position: results[0].geometry.location
            });
          } else {
            console.log('Geocode was not successful for the following reason: ' + status);
          }
        });
      })
    });
  }

};
