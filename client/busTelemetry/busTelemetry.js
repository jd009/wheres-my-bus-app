angular.module('wheresMyBusApp.busTelemetry', [])

.controller('telemetryCtrl', function($scope, CapitalMetro){
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

  var displayData = function(busses){
    $scope.updateTime = busses[0].Updatetime;
    $scope.signage = busses[0].Signage;
    $scope.route = busses[0].Route;
    $scope.direction = busses[0].Direction;
    $scope.speed = busses[0].Speed;
    $scope.position = busses[0].Position;
  }

  $scope.refreshData();
});
