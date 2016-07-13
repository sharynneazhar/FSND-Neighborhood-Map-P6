var mockData = '../mocks/addresses.json';
$.getJSON(mockData, function(data) {
  console.log(data.home);
  console.log(data.work);
  console.log(data.school);
});
