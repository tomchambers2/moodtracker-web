'use strict';

/**
 * @ngdoc function
 * @name moodtrackerWebApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the moodtrackerWebApp
 */
angular.module('moodtrackerWebApp')
  .controller('MainCtrl', function ($scope, $connect, $data, $sync, $auth, $timeout, messenger) {
  	$scope.loggedIn = $auth.check();

  	$scope.loginForm = {};

    var ref = $connect.ref;

    console.log($auth.getUserData());

    var showMoodData = function() {
      $scope.mood = {};
      $data.getMoodlogNumbers(function(data) {        
        $timeout(function() {
          $scope.mood.data = data;
        });
      });
    };

    showMoodData();

	var afterLogin = function(error, authData) {
		if (error) { 
			console.log(error); 
			return;
		}
		$scope.loggedIn = $auth.check();
		$scope.$apply();

    $sync.sync();

    showMoodData();

    messenger.success('Logged in');
	};

  	$scope.doLogin = function() {
     ref.authWithPassword({
        email    : $scope.loginForm.email,
        password : $scope.loginForm.password
      }, afterLogin);  		
  	}

  	$scope.doRegister = function() {
  		ref.createUser({
        email    : $scope.loginForm.email,
        password : $scope.loginForm.password
      }, function(error) {
        if (error) {
          console.log(error);
          return;
          messenger.success('Created account');
        }
        $scope.doLogin($scope.loginForm.email, $scope.loginForm.password);
      });
  	}
  });
