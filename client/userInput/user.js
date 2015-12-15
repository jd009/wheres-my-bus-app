angular.module('wheresMyBusApp.user', [])

.controller('userCtrl', function($scope, UserInput){
  $scope.searchBus = function(){
    console.log($scope.selectedBusRoute);
    console.log($scope.selectedDirection);
    UserInput.refreshWithUserInput($scope.selectedBusRoute, $scope.selectedDirection);
  };
});
