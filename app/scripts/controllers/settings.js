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

  	$scope.userEmail = $auth.getUserData() && $auth.getUserData().password.email;
  	$scope.userId = $auth.getUserData() && $auth.getUserData().uid;
  	$scope.authToken = $auth.getUserData().token;

  	$scope.doLogout = function() {
      $auth.doLogout();
  		$scope.loggedIn = $auth.check();
  	}  	
  });
