'use strict';

/**
 * @ngdoc function
 * @name moodtrackerWebApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the moodtrackerWebApp
 */
angular.module('moodtrackerWebApp')
.controller('MainCtrl', function ($scope, $rootScope, $connect, $data, $sync, $auth, $timeout, messenger) {
	mixpanel.track('main');

  $scope.loggedIn = $auth.check();

	$scope.loginForm = {};

  var ref = $connect.ref;

  var showMoodData = function() {
    $scope.mood = {};
    $data.getMoodlogNumbers(function(data) {        
      $timeout(function() {
        for (var id in data) {
          data[id].id = id; 
        }
        $scope.mood.data = data;
      });
    });
  };

  showMoodData();

  $scope.deleteRecord = function(id, offline) {
    $data.deleteRecord(id, offline).then(function() {
      messenger.success('Mood record deleted');
    }, function() {
      messenger.error('Couldn\'t delete mood record');
      throw new Error('Deleting a mood record failed',id);
    })
  };

	var afterLogin = function(error, authData) {
		if (error) { 
      messenger.error(error.message);
			return;
		}
		$scope.loggedIn = $auth.check();
		$scope.$apply();

    $sync.sync();

    showMoodData();

    messenger.success('Logged in');

    $rootScope.$broadcast('login');
	};

	$scope.doLogin = function() {
   ref.authWithPassword({
      email    : $scope.loginForm.email,
      password : $scope.loginForm.password
    }, afterLogin);  		
	}

	$scope.doRegister = function() {
    if (!$scope.loginForm.email && $scope.loginForm.password) {
      messenger.warn('Please enter an email and password to register');
    }

		ref.createUser({
      email    : $scope.loginForm.email,
      password : $scope.loginForm.password
    }, function(error) {
      if (error) {
        messenger.error(error.message);
        return;
      }
      messenger.success('Created account');
      $scope.doLogin($scope.loginForm.email, $scope.loginForm.password);
    });
	}

  $scope.resetForm = {};
  $scope.doPasswordReset = function() {
    ref.resetPassword({
      email: $scope.resetForm.email
    }, function(error) {
      if (error) {
        messenger.error(error.message);
        throw new Error('Could not reset password',$scope.resetForm.email);
      }
      messenger.success('Your new password has been emailed to'+$scope.resetForm.email);
      $timeout(function() {
        $scope.resetForm.email = '';
      })
    });
  }  
});
