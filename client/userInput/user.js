angular.module('wheresMyBusApp.user', [])

.controller('userCtrl', function($scope, UserInput, CapitalMetro){

  $scope.showLoading = function(){
    return CapitalMetro.requestInProgress();
  }

  $scope.getBusListOptions = function(){
    return CapitalMetro.getBusList();
  };

  $scope.searchBus = function(){
    console.log($scope.selectedBusRoute);
    console.log($scope.selectedDirection);
    UserInput.refreshWithUserInput($scope.selectedBusRoute, $scope.selectedDirection);
  };
});
