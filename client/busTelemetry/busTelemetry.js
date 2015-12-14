angular.module('wheresMyBusApp.busTelemetry', [])

.controller('telemetryCtrl', function($scope, $window, CapitalMetro){
  $scope.refreshData = function(){
    CapitalMetro.requestBusData()
    .then(function(data){
      return CapitalMetro.extractBusData(data);
    })
    .then(function(busses){
      displayData(busses);
    })
    .catch(function (error){
      console.log(error);
    });
  };

  var findDesiredBusRoute = function(desiredBusRoute, busses){
    return busses[0];
  }

  var displayData = function(busses){
    var currentBus = findDesiredBusRoute('7', busses);
    var currentBusLatAndLong = currentBus.Position.split(',');
    var currentBusLatitude = +currentBusLatAndLong[0];
    var currentBusLongitude = +currentBusLatAndLong[1];

    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(currentBusLatitude, currentBusLongitude),
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10
      },
      map: $window.mapCanvas,
      title: 'Current Bus'
    });

    marker.setMap($window.mapCanvas);

    $scope.updateTime = currentBus.Updatetime;
    $scope.signage = currentBus.Signage;
    $scope.route = currentBus.Route;
    $scope.direction = currentBus.Direction;
    $scope.speed = currentBus.Speed;
    $scope.position = currentBus.Position;
  }

  $scope.refreshData();
});
