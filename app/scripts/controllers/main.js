'use strict';

/**
 * @ngdoc function
 * @name moodtrackerWebApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the moodtrackerWebApp
 */
angular.module('moodtrackerWebApp')
  .controller('MainCtrl', function ($scope, $connect, $data, $auth) {
  	$scope.loggedIn = $auth.check();

  	$scope.loginForm = {};

    var ref = $connect.ref;

  	if ($scope.loggedIn) {
	  	$scope.mood = {};
	  	ref.child('moodlogNumbers').child($auth.getUserData().uid).on('value', function(data) {
	  		console.log('got data',data.val());
	  		$scope.mood.data = data.val();
	  		console.log($scope.mood.data)
	  		$scope.$apply();
	  	}, function(err) {
        console.log('failed to get mood data',err);
      });
  	}


	var afterLogin = function(error, authData) {
		if (error) { 
			console.log(error); 
			return;
		}
		$scope.loggedIn = $auth.check();
		$scope.$apply();

    $data.sync();
	};

  	$scope.doLogin = function() {
     ref.authWithPassword({
        email    : $scope.loginForm.email,
        password : $scope.loginForm.password
      }, afterLogin);  		
  	}

  	$scope.doRegister = function() {
  		$auth.doRegister($scope.loginForm.email, $scope.loginForm.password);
  	}

  	$scope.doLogout = function() {
  		$connect.ref.unauth();
  		$scope.loggedIn = $auth.check();
  	}
  });
