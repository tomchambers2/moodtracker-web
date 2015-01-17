'use strict';

/**
 * @ngdoc function
 * @name moodtrackerWebApp.controller:RecordCtrl
 * @description
 * # RecordCtrl
 * Controller of the moodtrackerWebApp
 */
angular.module('moodtrackerWebApp')
  .controller('RecordCtrl', ['$scope', '$localStorage', '$timeout', '$connect', '$connection', '$auth','$data', function ($scope, $localStorage, $timeout, $connect, $connection, $auth, $data) {
  	$scope.loggedIn = $auth.check();

  	var ref = $connect.ref;

	  $scope.saveMood = function(mood) {
	  	$data.saveMood(mood);
	  };   	

  }]);
