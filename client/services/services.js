angular.module('wheresMyBusApp.services', [])

.factory('CapitalMetro', function($http){
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
      return busses;
  }; 

  return {
    requestBusData: requestBusData,
    extractBusData: extractBusData
  };
});