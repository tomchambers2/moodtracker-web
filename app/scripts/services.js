'use strict';

angular.module('moodLogging', [])

.factory('$connect', [function() {
  return {
    ref: new Firebase('https://moodtrackerapp.firebaseio.com')
  };
}])

.factory('$auth', ['$connect', function($connect) {
  var ref = $connect.ref;

  var afterLogin = function(error, authData) {
    if (error) { console.log(error); }
    console.log(authData);
  };

  return {
    check: function() {
      var authData = ref.getAuth();
      console.log('Checking login',!!authData);
      return !!authData;
    },

    getUserData: function() {
      var authData = ref.getAuth();
      console.log('Checking login',authData);
      return authData;
    },    

    doLogin: function(email, password) {
      console.log(ref.authWithPassword({
        email    : email,
        password : password
      }, afterLogin));
    },

    doRegister: function() {

    },

    doLogout: function() {
      console.log('Logging out');
      return $connect.ref.unauth();
    }
  };
}])

.service('$data', ['$connect', '$auth', '$localStorage', function($connect, $auth, $localStorage) {
  var ref = $connect.ref;

  var sync = function() {
    if ($auth.check()) {
      var localData = $localStorage.getObject('offlineMoods');

      var anonData = $localStorage.getObject('moods');

      var doSync = function(data) {
        if (data) {
          for (var i = 0; i < data.length; i++) {
            ref.child('moodlogNumbers').child($auth.getUserData().uid).push(data[i], function(error) {
              if (error) {
                console.log("error syncing", error, $auth.getUserData());
              }
            });
          }
        }        
      };

      doSync(localData);
      doSync(anonData);
    } else {
      console.log('Tried to sync but user is not logged in');
    }
  };

  return {
    ref: ref,
    sync: sync
  };
}]);

angular.module('utils', [])

.factory('$localStorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    },
    push: function(key, value) {
      var data = $window.localStorage[key];
      if (data) {
        data = JSON.parse(data);
      } else {
        data = [];
      }
      data.push(value);
      $window.localStorage[key] = JSON.stringify(data);
    }
  };
}])

.service('$connection', ['$data', function($data) {
  var connectedRef = new Firebase('https://moodtrackerapp.firebaseio.com/.info/connected');

  var status;

  connectedRef.on('value', function(snap) {
    if (snap.val() === true) {
      status = true;

      $data.sync();
    } else {
      status = false;
    }
  }); 

  return {
    getStatus: function() {
      return status;
    }
  };
}]);