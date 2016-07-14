/*
  The bridge between the client and client-services
*/

// load the Google Maps API
loadMapScript();

var Location = function(data) {}

var ViewModel = function() {
  var self = this;

  self.searchAddress = ko.observable('');

  this.searchLocation = function() {
    var searchQuery = self.searchAddress();
    var place = GoogleService.getLocation(searchQuery);

    // reset the searchbox
    self.searchAddress('');
  };

}

ko.applyBindings(new ViewModel());
