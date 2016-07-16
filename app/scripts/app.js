/*
  The bridge between the client and client-services
*/

// load the Google Maps API
loadMapScript();

var ViewModel = function() {
  var self = this;
  self.searchAddress = ko.observable('');

  this.searchLocation = function() {
    var searchQuery = self.searchAddress();
    GoogleMapsService.clearMarkers();
    FoursquareService.getVenues(searchQuery);

    // reset the searchbox
    self.searchAddress('');
    $('input').blur();
  };

}

ko.applyBindings(new ViewModel());
