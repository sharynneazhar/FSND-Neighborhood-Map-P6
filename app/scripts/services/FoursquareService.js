/*
  Handles all the services from Foursquare API
  https://developer.foursquare.com/
*/

const FS_ID = '1GOXWBOA2FOS31OFVOFRNSF0OKSXFZHDLNK000TL4UH2TREM';
const FS_SECRET = 'F0RQFWMRFTTC4VLCNEXZEG5OSY42YVCS4Z3JJ5AL0C40QPY3';
const FS_BASE_URL = 'https://api.foursquare.com/v2/venues';

var FoursquareService = {

  // Retrieves all the venues matching search term
  getVenues: function(searchTerm) {
    var latlng = GoogleMapsService.currentLocation.lat + ',' + GoogleMapsService.currentLocation.lng;
    var queryURL = FS_BASE_URL + '/search'
      + '?client_id=' + FS_ID
      + '&client_secret=' + FS_SECRET
      + '&v=20130815'
      + '&ll=' + latlng
      + '&limit=10'
      + '&query=' + searchTerm;

    var venues = [];
    $.getJSON(queryURL, function(data) {
      var hasResponse = data
        && data.meta.code === 200
        && data.response.venues.length > 0;

      if (hasResponse) {
        $.each(data.response.venues, function(index, venue) {
          var venueObj = {
            id: venue.id,
            title: venue.name,
            contact: venue.contact.formattedPhone || '',
            url: venue.url || '',
            lat: venue.location.lat,
            long: venue.location.lng,
            address: venue.location.formattedAddress
          };
          venues.push(venueObj);
        });

        // Show markers on the map
        GoogleMapsService.showMarkers(venues);
      }
    });
  }

};
