/*
  Handles all the services from Google Maps API
  https://developers.google.com/maps/documentation/javascript/
*/

var map = null;
var marker = null;

function loadMapScript() {
  var script = document.createElement('script');
  script.async = true;
  script.type = 'text/javascript';
  script.src = GOOGLE_MAP_URL
    + GOOGLE_MAP_KEY
    + '&libraries=places'
    + '&callback=GoogleService.init';
  document.body.appendChild(script);
}

var GoogleService = {

  // Initializes the map background and markers
  init: function() {
    var mapOptions = {
      zoom: (DIMS.width < 662) ? 9 : 10,
      center: new google.maps.LatLng(38.951979, -94.837693),
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
    };

    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    this.getMarkers(PERSONALS);

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

  // Searches for the location specified and return a marker on the map
  getLocation: function(location) {
    console.log(location);

    // var geocoder = new google.maps.Geocoder();
    // var query = GOOGLE_MAP_QUERY + location;
    // $.getJSON(query, function(data) {
    //   $.each(data.predictions, function(place, info) {
    //     geocoder.geocode({'placeId': info.place_id}, function(results, status) {
    //       if (status === google.maps.GeocoderStatus.OK) {
    //         map.setCenter(results[0].geometry.location);
    //         marker = new google.maps.Marker({
    //           map: map,
    //           position: results[0].geometry.location
    //         });
    //       } else {
    //         console.log('Geocode was not successful for the following reason: ' + status);
    //       }
    //     });
    //   })
    // });
  }

};
