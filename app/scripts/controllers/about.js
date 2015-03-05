'use strict';

/**
 * @ngdoc function
 * @name moodtrackerWebApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the moodtrackerWebApp
 */
angular.module('moodtrackerWebApp')
  .controller('AboutCtrl', function ($scope, $data, $auth, $timeout) {
    mixpanel.track('history');

    $scope.loggedIn = $auth.check();


$scope.options = {
  axes: {
    x: {type: "date", key: "x"},
    y: {type: "linear", min: 0, max: 10, ticks: 10 }
  },
  series: [
    {
      y: "val_0",
      label: "Mood records",
      color: "#9467bd",
      axis: "y",
      type: "line",
      thickness: "3px",
      dotSize: 2,
      id: "series_0"
    }
  ],
  tooltip: {
    mode: "scrubber",
    formatter: function (x, y, series) {
      return moment(x).fromNow() + ' : ' + y;
    }
  },
  stacks: [],
  lineMode: "bundle",
  tension: 1,
  drawLegend: true,
  drawDots: true,
  columnsHGap: 5
};
  	
    $data.getMoodlogNumbers(function(data) {        
      $scope.mood = {
        data: []
      }
      var lastWeek = moment().subtract(60, 'minutes');
      for (var id in data) {
        if (moment(data[id].userTimestamp).isBefore(lastWeek)) {
          continue;
        };
        var entry = {x: new Date(data[id].userTimestamp), val_0: data[id].level}
        $scope.mood.data.push(entry);
        $scope.$apply();
      }
    });      	
  });
