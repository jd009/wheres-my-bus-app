angular.module('wheresMyBusApp.map', [])

.controller('mapCtrl', function($scope, $window){

  var mapOptions = {
    zoom: 12,
    center: new google.maps.LatLng(30.269033, -97.740235),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  $window.mapCanvas = new google.maps.Map(document.getElementById('mapCanvas'), mapOptions);

});
