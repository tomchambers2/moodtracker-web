'use strict';

/**
 * @ngdoc function
 * @name moodtrackerWebApp.controller:HeaderctrlCtrl
 * @description
 * # HeaderctrlCtrl
 * Controller of the moodtrackerWebApp
 */
angular.module('moodtrackerWebApp')
  .controller('HeaderCtrl', function ($scope, $location, $auth, $anchorScroll) {
  	$scope.isActive = function (viewLocation) { 
        return viewLocation === $location.path();
    };

    $scope.scrollToLogin = function() {
      $location.hash('login');
      $anchorScroll();
    }

	 $scope.loggedIn = $auth.check();    

    $scope.logout = function() {
      $auth.doLogout();
  		$scope.loggedIn = $auth.check();
      window.location.reload();
  	}

    $scope.$on('login', function() {
      $scope.loggedIn = $auth.check();
      $scope.$apply();
    })    
  });