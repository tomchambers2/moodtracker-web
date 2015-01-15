'use strict';

/**
 * @ngdoc function
 * @name moodtrackerWebApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the moodtrackerWebApp
 */
angular.module('moodtrackerWebApp')
  .controller('AboutCtrl', function ($scope, $connect, $auth) {
    $scope.loggedIn = $auth.check();

  	$scope.mood = {
  		data: {
  			labels: [],
  			datasets: [{
  				data: []
  			}]
  		}
  	};
  	
  	if (!$scope.loggedIn) return;

  	var ref = $connect.ref;


  	ref.child('moodlogNumbers').child($auth.getUserData().uid).on('value', function(data) {
  		var values = data.val();

  		var dates = [];
  		var moodLevels = [];
  		for (var id in values) {
  			dates.push(moment(values[id].timestamp).format('h:mm DD/MM/YY'));
  			moodLevels.push(values[id].level);
  		}

	  	$scope.mood = {
	  		data: {
	  			labels: dates,
	  			datasets: [{
	  				data: moodLevels
	  			}]
	  		}
	  	};

  		$scope.$apply();
  	});

    $scope.chartOptions = {
        segementStrokeWidth: 20,
        segmentStrokeColor: '#78B5EB'
    };  	
  });
