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

  var getUserLatitude = function(){
    return 30.269033;
  };

  var getUserLongitude = function(){
    return -97.740235;
  }

  return {
    setRefreshDataFunction: setRefreshDataFunction,
    refreshWithUserInput: refreshWithUserInput,
    getUserLatitude: getUserLatitude,
    getUserLongitude: getUserLongitude
  }
})
.factory('AppMap', function($window){
  var markersCache = [];

  var placeMarker = function(latitude, longitude, iconPath, iconScaledSize){
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(latitude, longitude),
      icon: {
        url: iconPath,
        scaledSize: iconScaledSize
      },
      animation: google.maps.Animation.DROP,
      map: $window.mapCanvas
    });

    marker.setMap($window.mapCanvas);
    markersCache.push(marker);
  };

  var removeAllMarkers = function(){
    markersCache.forEach(function(marker){
      marker.setMap(null);
    });

    markersCache = [];
  };

  return {
    placeMarker: placeMarker,
    removeAllMarkers: removeAllMarkers
  }
})
