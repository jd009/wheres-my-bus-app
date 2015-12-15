angular.module('wheresMyBusApp.user', [])

.controller('userCtrl', function($scope, UserInput, CapitalMetro){
  $scope.getBusListOptions = function(){
    return CapitalMetro.getBusList();
  };

  $scope.searchBus = function(){
    console.log($scope.selectedBusRoute);
    console.log($scope.selectedDirection);
    UserInput.refreshWithUserInput($scope.selectedBusRoute, $scope.selectedDirection);
  };
});
