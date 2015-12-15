angular.module('wheresMyBusApp.map', [])

.controller('mapCtrl', function($scope, $window, AppMap){
  var userLatitude = AppMap.getUserLatitude();
  var userLongitude = AppMap.getUserLongitude();

  var mapOptions = {
    zoom: 14,
    center: new google.maps.LatLng(userLatitude, userLongitude),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  $window.mapCanvas = new google.maps.Map(document.getElementById('mapCanvas'), mapOptions);

});
