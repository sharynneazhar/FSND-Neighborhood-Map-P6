/*
  Handles all the services from Google Maps API
  https://developers.google.com/maps/documentation/javascript/
*/

var map;

function loadMapScript() {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.src = GOOGLE_BASE_URL
    + '&callback=GoogleService.init';
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
      var markerHold = new google.maps.Marker({
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
    // Use HTML5 geolocation
    // TODO Find a geolocation service - look into Google's
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
        map.setCenter(currentLocation);
      }, function() {
        // TODO Use better error messaging
        console.log('Oops, something went wrong');
      });
    } else {
      // TODO Use better error messaging
      console.log('Oops, something went wrong');
    }
  }

};
