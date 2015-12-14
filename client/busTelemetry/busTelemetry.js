angular.module('wheresMyBusApp.busTelemetry', [])

.controller('telemetryCtrl', function($scope, CapitalMetro){
  $scope.updateDisplay = function(){
    CapitalMetro.requestBusData()
    .then(function(data){
      return CapitalMetro.extractBusData(data);
    })
    .then(function(busses){
      var x = busses;
    })
    .catch(function (error){
      console.log(error);
    });
  };

  $scope.updateDisplay();
});
