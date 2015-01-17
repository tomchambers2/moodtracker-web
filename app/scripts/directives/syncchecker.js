'use strict';

/**
 * @ngdoc directive
 * @name moodtrackerWebApp.directive:syncChecker
 * @description
 * # syncChecker
 */
angular.module('moodtrackerWebApp')
  .directive('syncChecker', function ($rootScope, $timeout) {
    return {
      restrict: 'E',
      template: '<alert ng-if="alert.msg" type="info" close="close.alert()">{{alert.msg}} <button class="btn btn-success" ng-click="alert.callback()">Sync data</button></alert>',
      link: function postLink(scope, element, attrs) {
        var close = {};
      	close.alert = function() {
      		$timeout(function() {
      			scope.alert = {};
      		});
      	};

      	$rootScope.$on('unauthSync', function(data, number, callback) {
      		$timeout(function() {
	      		scope.alert = {
	      			msg: 'You have '+number+' unsynced anonymous moods saved. Do you want to sync them with this account?',
	      			callback: callback
	      		}
      		});
      	});
      }
    };
  });
