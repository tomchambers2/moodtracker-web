'use strict';

/**
 * @ngdoc directive
 * @name moodtrackerWebApp.directive:syncChecker
 * @description
 * # syncChecker
 */
angular.module('moodtrackerWebApp')
  .directive('syncChecker', function ($rootScope, $timeout, $sync) {
    return {
      restrict: 'E',
      template: '<div class="alert alert-warning text-center" role="alert" ng-if="alert.msg" type="info" close="close.alert()"><p><i class="fa fa-exclamation-triangle"></i> {{alert.msg}}</p> <p><button class="btn btn-success" ng-click="sync()">Sync data</button> <button class="btn btn-danger" ng-click="clear()">Delete data</button></p></div>',
      link: function postLink(scope, element, attrs) {
      	$rootScope.$on('unauthSync', function(data, number, callback, clearCallback) {
      		$timeout(function() {
	      		scope.alert = {
	      			msg: 'You have '+number+' unsynced anonymous mood records. Do you want to sync them with this account?',
	      		};

            scope.sync = function() {
              callback();
              scope.alert = null;
            };

            scope.clear = function() {
              clearCallback();
              scope.alert = null;
            }
      		});
      	});

        $sync.checkUnauthSync();
      }
    };
  });
