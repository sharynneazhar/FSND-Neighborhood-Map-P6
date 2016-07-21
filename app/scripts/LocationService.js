// in reality, these keys should not be stored here
const YELP_BASE_URL = 'http://api.yelp.com/v2/search/';
const YELP_CONSUMER_KEY = 'TvJZDsVoUcBof1g4Vupo0Q';
const YELP_CONSUMER_SECRET = 'PEW3KTxsoUUGWROFC0vpzs2O2GM';
const YELP_TOKEN = 'eZugQLtOZa7f0ZV2VXRNb76pjTZrUT0T';
const YELP_TOKEN_SECRET = 'j-DHHnxNR7bvRpc5K7VqdLqmcDc';

const CURRENT_LOCATION = { lat: 39.090509, lng: -94.589111 };

var yelpLocations = [];
var markerArray = [];
var infoWindow;

var map = initialize();

if (!map) {
  alert('Oops, something went wrong with Google Maps. Please try again later!');
}

getYelpData(LOCATIONS);


/*
  Places all markers on the map
  @param locationArray - location with data retrieved from Yelp
*/
function setMarkers(locationArray) {
  clearMarkers();
  $.each(locationArray, function(index, location) {
    createMarker(location);
  });
}

// Clears existing markers that are displayed
function clearMarkers() {
  $.each(markerArray, function(index, marker) {
    marker.setMap(null);
  });
  markerArray = [];
}

/*
  Creates markers from a location object
  @param location - a location object containing data from Yelp
*/
function createMarker(location) {
  var latlng = new google.maps.LatLng(location.lat, location.lng);
  var marker = new google.maps.Marker({
    position: latlng,
    map: map,
    animation: google.maps.Animation.DROP,
  });

  var parseURL;
  if (location.url === '') {
    parseURL = '">';
  } else {
    parseURL = (location.url || '#') + '" target="_blank">Visit Website';
  }

  var content = '<div id="venue">'
    + '<h5 class="venue-name">' + (location.name || '') + '</h5>'
    + '<div class="venue-address">' + (location.address[0] || '')
    + '<br>' + (location.address[2] || location.address[1] || '') + '</div>'
    + '<div class="venue-contact">' + (location.phone || '') + '</div>'
    + '<div class="venue-url"><a href="' + parseURL + '</a></div>'
    + '<div class="venue-rating" style="margin-top:10px"><img src="' + (location.ratingImage || '' ) +'" /></div>'
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

  markerArray.push(marker);
}

/*
  Retrieve location data from Yelp API
  @param locationArray - a list of location objects with a name, coordinates, and address
*/
function getYelpData(locationArray) {
  // fetch data for each location in the array
  $.each(locationArray, function(index, location) {
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

    // generate an oauth signature
    params.oauth_signature = oauthSignature.generate(
      'GET',
      YELP_BASE_URL,
      params,
      YELP_CONSUMER_SECRET,
      YELP_TOKEN_SECRET
    );

    // call the API
    $.ajax({
      url: YELP_BASE_URL,
      data: params,
      cache: true,
      async: true,
      dataType: 'jsonp',
      success: function(data) {
        var loc = data.businesses[0];
        var locObject = {
          id: loc.id || '',
          name: loc.name || location.name,
          phone: loc.display_phone || '',
          url: loc.url || '',
          lat: loc.location.coordinate.latitude || location.lat,
          lng: loc.location.coordinate.longitude || location.lng,
          address: loc.location.display_address || location.address,
          ratingImage: loc.rating_img_url || '',
        };
        yelpLocations.push(locObject);
      },
      complete: function() {
        // when all locations have been loaded then display the markers
        // bad - but ok for this project
        if (yelpLocations.length === 7) {
          setMarkers(yelpLocations);
          vm.locations(yelpLocations);
          stopLoading();
        }
      },
      error: function(error) {
        alert('Oops, something went wrong requesting from Yelp. Please try again!');
        return;
      }
    });
  });
}

// Initializes the Google Map display
function initialize() {
  Splash.enable('circular');
  var mapContainer = document.getElementById('map');
  var mapOptions = {
    zoom: (DIMS.width < 662) ? 10 : 16,
    center: new google.maps.LatLng(
      CURRENT_LOCATION.lat,
      CURRENT_LOCATION.lng
    ),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapTypeControl: false,
    streetViewControl: false
  };
  infoWindow = new google.maps.InfoWindow();
  return new google.maps.Map(mapContainer, mapOptions);
}
