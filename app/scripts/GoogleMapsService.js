function loadMapScript() {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = GOOGLE_BASE_URL
    + '&sensor=FALSE'
    + '&callback=GoogleService.init';
  document.body.appendChild(script);
}

var GoogleService = {
  var map;
  var marker;

  init: function() {
    var mapOptions = {
      zoom: 15,
      center: new google.maps.LatLng(
        DEFAULT_LOC[0],
        DEFAULT_LOC[1]
      ),
      mapTypeControl: false,
    };

    map = new google.maps.Map(
      document.getElementById('map'), mapOptions
    );

    marker = new google.maps.Marker({
      position: new google.maps.LatLng(
        DEFAULT_LOC[0],
        DEFAULT_LOC[1]
      ),
      map: map,
      animation: google.maps.Animation.DROP
    });
  }

};
