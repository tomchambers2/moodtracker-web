'use strict';

/**
 * @ngdoc function
 * @name moodtrackerWebApp.controller:RecordCtrl
 * @description
 * # RecordCtrl
 * Controller of the moodtrackerWebApp
 */
angular.module('moodtrackerWebApp')
  .controller('RecordCtrl', function ($scope, $localStorage, $timeout, $connect, $connection, $auth) {
  	var ref = $connect.ref;

  	$scope.alerts = [];

  	var sendAlert = function(type, msg) {
  		$scope.alerts.push({
  			type: type,
  			msg: msg
  		});

  		var index = $scope.alerts.length - 1;

  		$timeout(function() {
  			$scope.alerts.splice(index, 1);
  		}, 1400)

  		$scope.$apply();
  	}

	  $scope.closeAlert = function(index) {
	    $scope.alerts.splice(index, 1);
	  };  	

	  $scope.saveMood = function(mood) {
	    console.log('online?',$connection.getStatus());

	    var data = {
	        level: mood,
	        serverTimestamp: Firebase.ServerValue.TIMESTAMP,
	        userTimestamp: Date.now()
	    };

	    if (!$connection.getStatus()) {
	      $localStorage.push('offlineMoods', data);
	      $cordovaDialogs.alert("You're offline. Data saved locally");
	      console.log($localStorage.getObject('offlineMoods'));
	      return;
	    };

	    var authData = $auth.getUserData();
	    if (authData) {
	      console.log('using authdata',authData.uid)
	      ref.child('moodlogNumbers').child(authData.uid).push(data, function(error) {
	        if (error) {
	          console.log(error);
	          console.log('Mood logging failed'); 
	          sendAlert('danger','Something went wrong and your mood wasn\'t saved') 
	          return;
	        }
	        sendAlert('success','Mood saved successfully') 
	      });      
	    } else {
	      $localStorage.push('moods', data);

	      console.log($localStorage.get('moods'))

	      console.log('Data saved locally. Log in or register to save online');
	    }
	  };   	

  });
