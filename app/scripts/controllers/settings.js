'use strict';

/**
 * @ngdoc function
 * @name moodtrackerWebApp.controller:SettingsCtrl
 * @description
 * # SettingsCtrl
 * Controller of the moodtrackerWebApp
 */
angular.module('moodtrackerWebApp')
  .controller('SettingsCtrl', function ($scope, $auth, $connect, messenger, $sync) {
  	$scope.loggedIn = $auth.check();
    var ref = $connect.ref;

    $scope.email = $auth.getUserData() && $auth.getUserData().password.email;

  	var userData = $auth.getUserData();
  	$scope.userEmail = userData && userData.password.email;
  	$scope.userId = userData && userData.uid;
  	$scope.authToken = userData && userData.token;

    var afterLogin = function(error, authData) {
      if (error) { 
        messenger.error(error.message);
        return;
      }
      $scope.loggedIn = $auth.check();
      $scope.$apply();

      $sync.sync();

      $rootScope.$broadcast('login');
    };

    var doLogin = function(email, password) {
     ref.authWithPassword({
        email    : email,
        password : password
      }, afterLogin);     
    }    

    $scope.emailForm = {};
    $scope.doChangeEmail = function() {
      ref.changeEmail({
        oldEmail: $auth.getUserData().password.email,
        newEmail: $scope.emailForm.email,
        password: $scope.emailForm.password
      }, function(error) {
        if (error) {
          messenger.error(error.message);
          throw new Error('Could not reset password',$scope.emailForm.email);
        }
        messenger.success('Your email has been set to '+$scope.emailForm.email);
        doLogin($scope.emailForm.email, $scope.emailForm.password);
        $scope.email = $scope.emailForm.email;
        $scope.emailForm = '';
      });    
    }

    $scope.changeForm = {};
    $scope.doChangePassword = function() {
      if (!$scope.changeForm.oldPassword || !$scope.changeForm.newPassword) {
        messenger.warning('Please enter both your old and new password');
      }

      ref.changePassword({
        email: $auth.getUserData().password.email,
        oldPassword: $scope.changeForm.oldPassword,
        newPassword: $scope.changeForm.newPassword
      }, function(error) {
        if (error) {
          messenger.error(err.message);
          throw new Error('Could not reset password');
        }
        messenger.success('Your password has been changed');
        $scope.changeForm = {};
      });
    }     	
  });
