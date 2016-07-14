var mockData = '../mocks/addresses.json';
$.getJSON(mockData, function(data) {
  console.log(data);
});

loadMapScript();
