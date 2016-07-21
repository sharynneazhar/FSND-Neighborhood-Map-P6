/*
  The bridge between the client and client-services
*/

// load the Google Maps API
loadMapScript();

// Location object constructor
var Location = function(data) {
  this.id = ko.observable(data.id);
  this.name = ko.observable(data.name);
  this.phone = ko.observable(data.phone);
  this.address = ko.observableArray(data.address);
  this.lat = ko.observable(data.lat);
  this.lng = ko.observable(data.lng);
  this.url = ko.observable(data.url);
  this.ratingImage = ko.observable(data.ratingImage);
};

var ViewModel = function() {
  var self = this;

  self.locationFilter = ko.observable('');
  self.locations = ko.observableArray([]);
  self.filteredLocations = ko.observableArray([]);
  self.listVisible = ko.observable(false);

  setTimeout(function() {
    $.each(yelpLocations, function(index, location) {
      self.locations.push(new Location(location));
    });
  }, 3500);

  self.filter = function() {
    self.filteredLocations([]);
    Splash.enable('circular');
    var query = self.locationFilter().toLowerCase();
    $.each(self.locations(), function(index, location) {
      var locationName = location.name().toLowerCase();
      if (locationName.indexOf(query) >= 0) {
        var loc = {
          name: location.name(),
          lat: location.lat(),
          lng: location.lng(),
        };
        self.filteredLocations.push(loc);
      }
    });

    if (self.filteredLocations().length > 0) {
      LocationService.getYelpData(self.filteredLocations());
      setTimeout(function() {
        LocationService.buildMarkers(yelpLocations);
      }, 1000);
    } else {
      alert('No locations found');
    }
  };

  self.openInfo = function() {
    self.toggle();

    Splash.enable('circular');

    var markObject = [{
      name: this.name,
      lat: this.lat,
      lng: this.lng
    }];

    LocationService.getYelpData(markObject);
    setTimeout(function() {
      LocationService.buildMarkers(yelpLocations);
      Splash.destroy();
    }, 1000);
  };

  self.toggle = function() {
    if (self.filteredLocations().length <= 0) {
      self.filter();
    }
    self.listVisible(!self.listVisible());
  }

}

ko.applyBindings(new ViewModel());
