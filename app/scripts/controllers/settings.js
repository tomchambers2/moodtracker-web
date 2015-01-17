'use strict';

/**
 * @ngdoc function
 * @name moodtrackerWebApp.controller:SettingsCtrl
 * @description
 * # SettingsCtrl
 * Controller of the moodtrackerWebApp
 */
angular.module('moodtrackerWebApp')
  .controller('SettingsCtrl', function ($scope, $auth) {
  	$scope.loggedIn = $auth.check();

  	var userData = $auth.getUserData();
  	$scope.userEmail = userData && userData.password.email;
  	$scope.userId = userData && userData.uid;
  	$scope.authToken = userData && userData.token;

  	$scope.doLogout = function() {
      $auth.doLogout();
  		$scope.loggedIn = $auth.check();
  	}  	
  });
