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
  });
