/*
  Handles all the services from Google Maps and Yelp APIs
  https://developers.google.com/maps/documentation/javascript/
  https://www.yelp.com/developers/
*/

const DIMS = {
  'height': $(window).height(),
  'width': $(window).width()
};

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

var map = null;
var markerObjects = [];
var markers = [];

var LocationService = {

  // Set default location
  currentLocation: { lat: 39.090509, lng: -94.589111},

  // Initializes the map background and markers
  init: function() {
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

    map = new google.maps.Map(mapContainer, mapOptions);
    LocationService.getYelpData(LOCATIONS);
    setTimeout(function() {
      LocationService.showMarkers(markerObjects);
    }, 3000);
  },

  // Creates markers with info window popups from a list of locations
  createMarkers: function(list) {
    var infoWindow = new google.maps.InfoWindow();
    $.each(list, function(place, info) {
      var marker = new google.maps.Marker({
        title: info.name,
        position: new google.maps.LatLng(
          info.lat,
          info.lng
        ),
        map: map,
        animation: google.maps.Animation.DROP
      });

      var content = '<div id="venue">'
        + '<div class="venue-name">' + (info.name || '') + '</div>'
        + '<div class="venue-url"><a href="' + (info.url || '') + '">Visit Website</a></div>'
        + '<div class="venue-address">' + (info.address[0] || '')
        + '<br>' + (info.address[2] || info.address[1] || '') + '</div>'
        + '<div class="venue-contact">' + (info.contact || '') + '</div>'
        + '<div class="venue-rating">' + (info.rating || '') + '<img src="' + (info.ratingImage || '' ) +'" /></div>'
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

      markers.push(marker);
    });
  },

  // Displays the markers on the map and recenter map / refit boundaries
  showMarkers: function(venues) {
    this.createMarkers(venues);
    var bounds = new google.maps.LatLngBounds();
    $.each(markers, function(index, marker) {
      bounds.extend(marker.getPosition());
      marker.setMap(map);
    });
    // Center the map on visible markers
    map.fitBounds(bounds);
  },

  // Clear existing markers that are displayed on the map
  clearMarkers: function() {
    $.each(markers, function(index, marker) {
      marker.setMap(null);
    });
    markers = [];
  },

  // Retrieve location data from Yelp API
  getYelpData: function(location) {
    $.each(location, function(index, info) {
      var params = {
        oauth_consumer_key: YELP_CONSUMER_KEY,
        oauth_token: YELP_TOKEN,
        oauth_nonce: nonceString(15),
        oauth_timestamp: Math.floor(Date.now() / 1000),
        oauth_signature_method: 'HMAC-SHA1',
        oauth_version: '1.0',
        callback: 'cb',
        term: info.name,
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
            name: loc.name || info.name,
            phone: loc.display_phone || '',
            url: loc.url || '',
            lat: loc.location.coordinate.latitude || info.lat,
            lng: loc.location.coordinate.longitude || info.long,
            address: loc.location.display_address || info.address,
            rating: loc.rating || '',
            ratingImage: loc.rating_img_url || '',
          };
          markerObjects.push(locObject);
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
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
  return text;
};
