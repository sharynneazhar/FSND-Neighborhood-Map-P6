/*
  Handles all the services from Google Maps and Yelp APIs
  https://developers.google.com/maps/documentation/javascript/
  https://www.yelp.com/developers/
*/

// in reality, these keys should not be stored here
const GMAP_KEY = '?key=AIzaSyCKioYCg26ODl5A4Z2K03OFkXJRT1mBpRk';
const GMAP_BASE_URL = 'http://maps.googleapis.com/maps/';
const GMAP_FULL_URL = GMAP_BASE_URL + 'api/js' + GMAP_KEY + '&libraries=places&callback=LocationService.init';
const GMAP_QUERY_URL = GMAP_BASE_URL + 'api/place/queryautocomplete/json' + GMAP_KEY + '&input=';

const YELP_BASE_URL = 'http://api.yelp.com/v2/search/';
const YELP_CONSUMER_KEY = 'TvJZDsVoUcBof1g4Vupo0Q';
const YELP_CONSUMER_SECRET = 'PEW3KTxsoUUGWROFC0vpzs2O2GM';
const YELP_TOKEN = 'eZugQLtOZa7f0ZV2VXRNb76pjTZrUT0T';
const YELP_TOKEN_SECRET = 'j-DHHnxNR7bvRpc5K7VqdLqmcDc';

const DIMS = {
  'height': $(window).height(),
  'width': $(window).width()
};

var Splash = window.Splash;

var map = null;
var yelpLocations = [];
var markerArray = [];

var LocationService = {

  // Set default location
  currentLocation: { lat: 39.090509, lng: -94.589111},

  // Initializes the map with all locations displayed
  init: function() {
    Splash.enable('circular');
    var mapContainer = document.getElementById('map');
    var mapOptions = {
      zoom: (DIMS.width < 662) ? 10 : 12,
      center: new google.maps.LatLng(
        this.currentLocation.lat,
        this.currentLocation.lng
      ),
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
      streetViewControl: false
    };

    // Creates the map using Google Map constructor
    map = new google.maps.Map(mapContainer, mapOptions);
    LocationService.getYelpData(LOCATIONS);

    // TODO: Fix this hack stemming from async calls
    setTimeout(function() {
      LocationService.displayMarkers(yelpLocations);
      if (Splash.isRunning) {
        Splash.destroy();
      }
    }, 3000);
  },

  /*
    Creates markers from a location object
    @param location - an objects with data retrived from getYelpData()
  */
  createMarker: function(location) {
    var infoWindow = new google.maps.InfoWindow();

    var marker = new google.maps.Marker({
      title: location.name,
      position: new google.maps.LatLng(
        location.lat,
        location.lng
      ),
      map: map,
      animation: google.maps.Animation.DROP
    });

    var content = '<div id="venue">'
      + '<div class="venue-name">' + (location.name || '') + '</div>'
      + '<div class="venue-url"><a href="' + (location.url || '#') + '">Visit Website</a></div>'
      + '<div class="venue-address">' + (location.address[0] || '')
      + '<br>' + (location.address[2] || location.address[1] || '') + '</div>'
      + '<div class="venue-contact">' + (location.contact || '') + '</div>'
      + '<div class="venue-rating">' + (location.rating || '')
      + '<img class="venue-rating-img" src="' + (location.ratingImage || '' ) +'" /></div>'
      +'</div>';

    google.maps.event.addListener(marker, 'click', function() {
      if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
      } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout( function() { marker.setAnimation(null); }, 750);
      }
      infoWindow.setContent(content);
      infoWindow.open(map, marker);
    });

    return marker;
  },

  /*
    Displays all the markers currently in the marker array
    @param locations - a list of location objects
  */
  displayMarkers: function(locations) {
    var bounds = new google.maps.LatLngBounds();
    $.each(locations, function(index, location) {
      var marker = LocationService.createMarker(location);
      bounds.extend(marker.getPosition());
      marker.setMap(map);
    });
    map.fitBounds(bounds);
    if (DIMS.width > 662) {
      map.setZoom(17);
    }
  },

  // Clears existing markers that are displayed
  clearMarkers: function() {
    $.each(markerArray, function(index, marker) {
      marker.setMap(null);
    });
    markerArray = [];
  },

  /*
    Retrieve location data from Yelp API
    @param locations - a list of location objects with a name, coordinates, and address
  */
  getYelpData: function(locations) {
    $.each(locations, function(index, location) {
      var params = {
        oauth_consumer_key: YELP_CONSUMER_KEY,
        oauth_token: YELP_TOKEN,
        oauth_nonce: nonceString(15),
        oauth_timestamp: Math.floor(Date.now() / 1000),
        oauth_signature_method: 'HMAC-SHA1',
        oauth_version: '1.0',
        callback: 'cb',
        term: location.name,
        location: 'Kansas City, MO',
        limit: 1
      };

      var signature = oauthSignature.generate(
        'GET',
        YELP_BASE_URL,
        params,
        YELP_CONSUMER_SECRET,
        YELP_TOKEN_SECRET
      );

      params.oauth_signature = signature;

      $.ajax({
        url: YELP_BASE_URL,
        data: params,
        cache: true,
        dataType: 'jsonp',
        success: function(data) {
          var loc = data.businesses[0];
          var locObject = {
            id: loc.id || '',
            name: loc.name || location.name,
            phone: loc.display_phone || '',
            url: loc.url || '',
            lat: loc.location.coordinate.latitude || location.lat,
            lng: loc.location.coordinate.longitude || location.long,
            address: loc.location.display_address || location.address,
            rating: loc.rating || '',
            ratingImage: loc.rating_img_url || '',
          };

          yelpLocations.push(locObject);
        },
        error: function(error) {
          console.log(error)
        }
      });
    });
  }

};

function loadMapScript() {
  var script = document.createElement('script');
  script.async = true;
  script.type = 'text/javascript';
  script.src = GMAP_FULL_URL;
  document.body.appendChild(script);
}

function nonceString(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
  return text;
};
