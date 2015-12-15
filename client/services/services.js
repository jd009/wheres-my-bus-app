angular.module('wheresMyBusApp.services', [])

.factory('CapitalMetro', function($http){
  var busRouteList = null;

  var requestBusData = function(){
    return $http({
      method: 'GET',
      url: '/busData'
    })
    .then(function(response){
      return response.data;
    });
  };

  var extractBusData = function(serverResponseData){
      var busses = serverResponseData["soap:Envelope"]
                                     ["soap:Body"]
                                     ["FleetlocationResponse"]
                                     ["Vehicles"]
                                     ["Vehicle"];
      populateBusList(busses);
      return busses;
  }; 

  var populateBusList = function(busses){
    busRouteList = [];
    for(var busIndex = 0; busIndex < busses.length; busIndex++){
      var currentBusRoute = busses[busIndex].Route;
      if(busRouteList.indexOf(currentBusRoute) === -1){
        busRouteList.push(currentBusRoute);
      }
    }
    busRouteList.sort(function(a,b){
      return a - b;
    });
  };

  var getBusList = function(){
    return busRouteList;
  };

  return {
    requestBusData: requestBusData,
    extractBusData: extractBusData,
    populateBusList: populateBusList,
    getBusList: getBusList
  };
})
.factory('UserInput', function(){
  var refreshDataFunction = null;
  var setRefreshDataFunction = function(refreshFunc){
    refreshDataFunction = refreshFunc;
  };

  var refreshWithUserInput = function(busRoute, busDirection){
    refreshDataFunction(busRoute, busDirection);
  };

  return {
    setRefreshDataFunction: setRefreshDataFunction,
    refreshWithUserInput: refreshWithUserInput
  }
})
.factory('AppMap', function($window){
  var markersCache = [];
  var userMarker = null;

  var getUserLatitude = function(){
    var userLatitude = null;
    if(userMarker === null){
      userLatitude = 30.269033;
    } else {
      userLatitude = userMarker.position.lat();
    }
    return userLatitude;
  };

  var getUserLongitude = function(){
    var userLongitude = null;
    if(userMarker === null){
      userLongitude = -97.740235;
    } else {
      userLongitude = userMarker.position.lng();
    }
    return userLongitude;
  }

  var placeMarker = function(isUser, latitude, longitude, iconPath, iconScaledSize){
    var isDraggable = isUser;
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(latitude, longitude),
      icon: {
        url: iconPath,
        scaledSize: iconScaledSize
      },
      animation: google.maps.Animation.DROP,
      draggable: isDraggable,
      map: $window.mapCanvas
    });

    marker.setMap($window.mapCanvas);
    markersCache.push(marker);
    if(isUser){
      userMarker = marker;
    }
  };

  var removeAllMarkers = function(){
    markersCache.forEach(function(marker){
      marker.setMap(null);
    });

    markersCache = [];
  };

  return {
    placeMarker: placeMarker,
    removeAllMarkers: removeAllMarkers,
    getUserLatitude: getUserLatitude,
    getUserLongitude: getUserLongitude
  }
});
