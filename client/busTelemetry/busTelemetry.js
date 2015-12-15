angular.module('wheresMyBusApp.busTelemetry', [])

.controller('telemetryCtrl', function($scope, CapitalMetro, UserInput, AppMap){
  $scope.warning = '';

  $scope.refreshData = function(busRoute, busDirection){
    var displayBussesEnabled = (busRoute) && (busDirection);

    AppMap.removeAllMarkers();
    CapitalMetro.requestBusData()
    .then(function(data){
      return CapitalMetro.extractBusData(data);
    })
    .then(function(busses){
      if(displayBussesEnabled){
        displayData(busses, busRoute, busDirection);
      } else {
        displayUser();
      }
    })
    .catch(function (error){
      console.log(error);
    });
  };

  UserInput.setRefreshDataFunction($scope.refreshData);

  var findDesiredBusRoute = function(desiredBusRoute, busses, busDirection){
    var bussesOnDesiredRoute = [];
    for(var busIndex = 0; busIndex < busses.length; busIndex++){
      var currentBus = busses[busIndex];
      var currentRoute = currentBus.Route;
      var currentDirection = currentBus.Direction;
      if(currentRoute === desiredBusRoute){
        if(currentDirection === busDirection ||
           busDirection === 'All'){
          bussesOnDesiredRoute.push(currentBus);
        }
      }
    }

    return bussesOnDesiredRoute;
  };

  var findClosestBus = function(bussesOnRoute, busDirection){
    var userLatitude = AppMap.getUserLatitude(); 
    var userLongitude = AppMap.getUserLongitude();

    var minimumDistance = Number.MAX_VALUE;
    var closestBus = null;
    for(var routeBusIndex = 0; 
        routeBusIndex < bussesOnRoute.length;
        routeBusIndex++)
    {
      var routeBus = bussesOnRoute[routeBusIndex];
      var routeBusPosition = routeBus.Position;
      var routeBusLatAndLong = routeBusPosition.split(',');
      var routeBusLatitude = +routeBusLatAndLong[0];
      var routeBusLongitude = +routeBusLatAndLong[1];
      var routeBusDirection = routeBus.Direction;

      var isClosestBus = false;
      placeBusMarker(routeBusLatitude, routeBusLongitude, routeBusDirection, isClosestBus);

      var distanceFromRouteBus = getDistanceFromLatLonInKm(
                                   userLatitude,
                                   userLongitude,
                                   routeBusLatitude,
                                   routeBusLongitude);
      if(distanceFromRouteBus < minimumDistance){
        minimumDistance = distanceFromRouteBus;
        closestBus = routeBus;
      }
    }

    return closestBus;
  };

  var displayUser = function(){
    var userLatitude = AppMap.getUserLatitude();
    var userLongitude = AppMap.getUserLongitude();
    placeUserMarker(userLatitude, userLongitude);
  };

  var displayData = function(busses, busRoute, busDirection){
    var bussesOnRoute = findDesiredBusRoute(busRoute, busses, busDirection);
    var closestBus = findClosestBus(bussesOnRoute, busDirection);
    if(closestBus === null){
      $scope.warning = "No bus found!";
      return;
    } else {
      $scope.warning = '';
    }
    var closestBusLatAndLong = closestBus.Position.split(',');
    var closestBusLatitude = +closestBusLatAndLong[0];
    var closestBusLongitude = +closestBusLatAndLong[1];
    var closestBusDirection = closestBus.Direction;

    var isClosestBus = true;
    placeBusMarker(closestBusLatitude, closestBusLongitude, closestBusDirection, isClosestBus);

    $scope.updateTime = closestBus.Updatetime;
    $scope.signage = closestBus.Signage;
    $scope.route = closestBus.Route;
    $scope.direction = closestBus.Direction;
    $scope.speed = closestBus.Speed;
    $scope.position = closestBus.Position;
  };

  var getDistanceFromLatLonInKm = function(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
  };

  var deg2rad = function(deg) {
    return deg * (Math.PI/180)
  };

  var placeUserMarker = function(latitude, longitude){
    var userIconPath = './icons/user.png';
    var userIconScaledSize = new google.maps.Size(50, 50);

    var isUser = true;
    AppMap.placeMarker(isUser, latitude, longitude, userIconPath, userIconScaledSize);
  };

  var placeBusMarker = function(latitude, longitude, direction, isClosest){
    var iconPath = null;
    if(isClosest){
      iconPath = './icons/busGreen.png';
    } else if(direction === 'N' || direction === 'O'){
      iconPath = './icons/busBlue.png';
    } else if(direction === 'S' || direction === 'I'){
      iconPath = './icons/busRed.png';
    } else if(direction === 'W'){
      iconPath = './icons/busPurple.png';
    } else if(direction === 'E'){
      iconPath = './icons/busYellow.png';
    } else {
      throw new Error('Unrecognized paramter!');
    }

    var iconScaledSize = new google.maps.Size(25, 25);
    var isUser = false;
    AppMap.placeMarker(isUser, latitude, longitude, iconPath, iconScaledSize);
  }

  $scope.refreshData();
});
