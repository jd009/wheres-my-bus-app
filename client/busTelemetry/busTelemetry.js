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
    var bussesOnDesiredRoute = [];
    for(var busIndex = 0; busIndex < busses.length; busIndex++){
      var currentBus = busses[busIndex];
      var currentRoute = currentBus.Route;
      if(currentRoute === desiredBusRoute){
        bussesOnDesiredRoute.push(currentBus);
      }
    }

    var currentLatitude = 30.269033; 
    var currentLongitude = -97.740235;
    var minimumDistance = Number.MAX_VALUE;
    var closestBus = null;
    for(var routeBusIndex = 0; 
        routeBusIndex < bussesOnDesiredRoute.length;
        routeBusIndex++)
    {
      var routeBus = bussesOnDesiredRoute[routeBusIndex];
      var routeBusPosition = routeBus.Position;
      var routeBusLatAndLong = routeBusPosition.split(',');
      var routeBusLatitude = +routeBusLatAndLong[0];
      var routeBusLongitude = +routeBusLatAndLong[1];

      var distanceFromRouteBus = getDistanceFromLatLonInKm(
                                   currentLatitude,
                                   currentLongitude,
                                   routeBusLatitude,
                                   routeBusLongitude);
      if(distanceFromRouteBus < minimumDistance){
        minimumDistance = distanceFromRouteBus;
        closetBus = routeBus;
      }
    }

    return closetBus;
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

  $scope.refreshData();
});
