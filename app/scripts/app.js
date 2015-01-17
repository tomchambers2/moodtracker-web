'use strict';

/**
 * @ngdoc overview
 * @name moodtrackerWebApp
 * @description
 * # moodtrackerWebApp
 *
 * Main module of the application.
 */
angular
  .module('moodtrackerWebApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'utils',
    'moodLogging',
    'angularMoment',
    'chartjs',
    'ui.bootstrap',
    'ngToast',
    'angular-flash.service',
    'angular-flash.flash-alert-directive',
    'MessageCenterModule',
    'mgcrea.ngStrap',
    'angular-growl',
    'variantTools'
  ])
  .config(function (flashProvider) {

      // Support bootstrap 3.0 "alert-danger" class with error flash types
      flashProvider.errorClassnames.push('alert-danger');

      /**
       * Also have...
       *
       * flashProvider.warnClassnames
       * flashProvider.infoClassnames
       * flashProvider.successClassnames
       */

  })  
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/settings', {
        templateUrl: 'views/settings.html',
        controller: 'SettingsCtrl'
      })      
      .when('/settings', {
        templateUrl: 'views/settings.html',
        controller: 'SettingsCtrl'
      })
      .when('/record', {
        templateUrl: 'views/record.html',
        controller: 'RecordCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
