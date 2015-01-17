'use strict';

/**
 * @ngdoc function
 * @name moodtrackerWebApp.controller:HeaderctrlCtrl
 * @description
 * # HeaderctrlCtrl
 * Controller of the moodtrackerWebApp
 */
angular.module('moodtrackerWebApp')
  .controller('HeaderCtrl', function ($scope, $location) {
  	$scope.isActive = function (viewLocation) { 
        return viewLocation === $location.path();
    };
  });