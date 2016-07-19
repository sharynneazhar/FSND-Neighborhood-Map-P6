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
  this.address = ko.observable(data.address);
  this.lat = ko.observable(data.lat);
  this.lng = ko.observable(data.lng);
  this.url = ko.observable(data.url);
  this.rating = ko.observable(data.rating);
  this.ratingImage = ko.observable(data.image);

  var marker = new google.maps.Marker({
    title: this.name(),
    position: new google.maps.LatLng(
      this.lat(),
      this.lng()
    ),
    map: map,
  });

  this.marker = ko.observable(marker);
};

var ViewModel = function() {
  var self = this;

  self.locationFilter = ko.observable('');
  self.filteredLocations = ko.observable([]);

  self.filter = function() {
    console.log('Filtering ', self.locationFilter());
  };

}

ko.applyBindings(new ViewModel());
