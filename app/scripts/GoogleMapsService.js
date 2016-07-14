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
  init: function() {
    var mapOptions = {
      zoom: 10,
      center: new google.maps.LatLng(38.951979, -94.837693),
      mapTypeControl: false,
    };

    map = new google.maps.Map(
      document.getElementById('map'), mapOptions
    );

    this.getDefaultMarkers();

    var streetView = map.getStreetView();
    streetView.addListener('visible_changed', function() {
      if (streetView.getVisible()) {
        $('#searchbar').css('display', 'none');
      } else {
        $('#searchbar').css('display', 'flex');
      }
    });
  },

  getDefaultMarkers: function() {
    $.getJSON(ADDRESSES, function(data) {
      $.each(data, function(place, info) {
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
    });
  }

};
