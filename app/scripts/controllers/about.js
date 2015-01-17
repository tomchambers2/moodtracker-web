'use strict';

/**
 * @ngdoc function
 * @name moodtrackerWebApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the moodtrackerWebApp
 */
angular.module('moodtrackerWebApp')
  .controller('AboutCtrl', function ($scope, $data, $auth, $timeout) {
    $scope.loggedIn = $auth.check();

  	$scope.mood = {
  		data: {
  			labels: [],
  			datasets: [{
  				data: []
  			}]
  		}
  	};
  	
    $data.getMoodlogNumbers(function(data) {        
      var values = data;

      var dates = [];
      var moodLevels = [];
      for (var id in values) {
        dates.push(moment(values[id].timestamp).format('h:mm DD/MM/YY'));
        moodLevels.push(values[id].level);
      }

      $timeout(function() {
        $scope.mood = {
          data: {
            labels: dates,
            datasets: [{
              data: moodLevels
            }]
          }
        };
      })
    });    

    $scope.chartOptions = {
        segementStrokeWidth: 20,
        segmentStrokeColor: '#78B5EB',
        datasetFill: false
    };  	
  });
