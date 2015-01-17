'use strict';

/**
 * @ngdoc filter
 * @name moodtrackerWebApp.filter:orderObjectBy
 * @function
 * @description
 * # orderObjectBy
 * Filter in the moodtrackerWebApp.
 */
angular.module('moodtrackerWebApp')
.filter('orderObjectBy', function() {
  return function(items, field, reverse) {
    var filtered = [];
    angular.forEach(items, function(item) {
      filtered.push(item);
    });
    filtered.sort(function (a, b) {
      return (a[field] > b[field] ? 1 : -1);
    });
    if(reverse) filtered.reverse();
    return filtered;
  };
});

