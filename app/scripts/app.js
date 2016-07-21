/*
  The bridge between the client and client-services
*/

var ViewModel = function() {
  var self = this;

  self.locationFilter = ko.observable();
  self.locations = ko.observableArray([]);
  self.filteredLocations = ko.observableArray([]);
  self.filteredVisible = ko.observable(false);
  self.menuVisible = ko.observable(false);

  self.filter = function() {
    Splash.enable('circular');
    self.filteredLocations([]);
    var query = self.locationFilter().toLowerCase();

    if (self.locationFilter() === '') {
      self.toggle();
      setMarkers(self.locations());
    }

    $.each(self.locations(), function(index, location) {
      var locationName = location.name.toLowerCase();
      if (locationName.indexOf(query) >= 0) {
        self.toggle();
        var loc = {
          name: location.name,
          address: location.address,
          phone: location.phone,
          lat: location.lat,
          lng: location.lng,
          url: location.url,
          ratingImage: location.ratingImage
        };
        self.filteredLocations.push(loc);
      }
    });

    if (self.filteredLocations().length > 0) {
      setMarkers(self.filteredLocations());
      stopLoading();
    } else {
      alert('No locations found');
    }
  };

  self.openInfo = function() {
    self.toggle();
    Splash.enable('circular');
    var loc = [{
      name: this.name,
      address: this.address,
      phone: this.phone,
      lat: this.lat,
      lng: this.lng,
      url: this.url,
      ratingImage: this.ratingImage
    }];
    setMarkers(loc);
    stopLoading();
  };

  self.toggle = function() {
    if (self.menuVisible()) {
      self.toggleMenu();
    }
    self.filteredVisible(!self.filteredVisible());
  };

  self.toggleMenu = function() {
    if (self.filteredVisible()) {
      self.toggle();
    }
    self.menuVisible(!self.menuVisible());
  };

};

var vm = new ViewModel();
