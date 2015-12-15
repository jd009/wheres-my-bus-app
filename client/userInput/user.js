angular.module('wheresMyBusApp.user', [])

.controller('userCtrl', function($scope){
  $scope.searchBus = function(){
    console.log($scope.selectedBusRoute);
    console.log($scope.selectedDirection);
  };
});
