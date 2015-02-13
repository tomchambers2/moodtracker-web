'use strict';

angular.module('variantTools', [])

.service('messenger', [function() {
  return {
    warning: toastr.warning,
    error: toastr.error,
    success: toastr.success
  };
}]);

angular.module('moodLogging', [])

.factory('$connect', [function() {
  return {
    ref: new Firebase('https://moodtrackerapp.firebaseio.com')
  };
}])

.factory('$auth', ['$connect','$localStorage','messenger', function($connect,$localStorage,messenger) {
  var ref = $connect.ref;

  var self = this;

  return {
    check: function() {
      var authData = ref.getAuth();
      return !!authData;
    },

    uid: function() {
      return ref.getAuth().uid;
    },

    getUserData: function() {
      var authData = ref.getAuth();
      return authData;
    },

    doLogout: function() {
      console.log('Logging out');

      $localStorage.set('moodCache', null);

      messenger.success('Logged out');

      return $connect.ref.unauth();
    }
  };
}])

.service('$data', ['$connect', '$q', '$auth', '$localStorage', '$connection', 'messenger', function($connect, $q, $auth, $localStorage, $connection, messenger) {
  var ref = $connect.ref;

  var appendOfflineData = function(data) {
    var localData = $localStorage.getObject($auth.uid+'offlineMoods');

    if (!localData.length) return data;
    if (!data) {
      data = {};
    };

    for (var i = 0; i < localData.length; i++) {
      localData[i].offline = true;
      data[localData[i].userTimestamp] = localData[i];
    };

    return data;
  }

  var appendUnauthData = function(data) {
    var anonData = $localStorage.getObject('moods');

    if (!anonData.length) return data;
    if (!data) {
      data = {};
    };    

    for (var i = 0; i < anonData.length; i++) {
      anonData[i].offline = true;
      data[anonData[i].userTimestamp] = anonData[i];
    };
    return data;
  }  

  var getMoodlogNumbers = function(callback) {
    if ($connection.getStatus() && $auth.check()) {
      //online and logged in - show them their data + offline data + unauth data
      console.log('Online. Authed. Showing fb data + offline + unauth');
      ref.child('moodlogNumbers').child($auth.getUserData().uid).on('value', function(rawData) {
        var data = rawData.val();
        var appendedData = appendOfflineData(data);
        appendedData = appendUnauthData(appendedData);
        callback(appendedData);   
      }, function(err) {
        console.log('failed to get mood data',err);
      }); 
    } else if ($auth.check()) {
      console.log('Offline. Authed. Showing offline + unauth');
      //authenticated, but not online - use this user's cached data + offline + unauth
      data = null;
      var appendedData = appendOfflineData(data);
      appendedData = appendUnauthData(appendedData);
      callback(appendedData);

      ref.child('moodlogNumbers').child($auth.getUserData().uid).on('value', function(rawData) {
        var data = rawData.val();
        var appendedData = appendOfflineData(data);
        appendedData = appendUnauthData(appendedData);
        callback(appendedData);  
      }, function(err) {
        console.log('failed to get mood data',err);
      }); 
    } else {
      console.log('Offline. Unauthed. Showing unauth');
      var data = null;
      //user is offline and not authed - show unauth data
      var appendedData = appendUnauthData(data);
      callback(appendedData);      
    }
  };

  var saveMood = function(mood) {
    var data = {
        level: mood,
        serverTimestamp: Firebase.ServerValue.TIMESTAMP,
        userTimestamp: Date.now()
    };

    if (!$auth.check()) {
      $localStorage.push('moods', data);
      messenger.warning('You\'re not logged in. Mood saved locally. Login or register to sync.');
    };

    if (!$connection.getStatus()) {
      $localStorage.push($auth.uid+'offlineMoods', data);
      messenger.warning('You\'re offline. Mood saved locally. Will be synced automatically when next online');
      return;
    };

    var authData = $auth.getUserData();
    if (authData) {
      ref.child('moodlogNumbers').child(authData.uid).push(data, function(error) {
        if (error) {
          console.log(error, 'Mood logging failed');
          messenger.error('Something went wrong and your mood wasn\'t saved')
          return;
        }

        messenger.success('Mood saved successfully');
      });      
    }
  };   

  var deleteRecord = function(id) {

    return $q(function(resolve, reject) {
      var onComplete = function(error) {
        if (error) {
          console.log('failed');
          reject();
        } else {
          console.log('worked');
          resolve();
        }
      };

      var authData = $auth.getUserData();
      ref.child('moodlogNumbers').child(authData.uid).child(id).remove(onComplete);
    });
  };

  return {
    ref: ref,
    getMoodlogNumbers: getMoodlogNumbers,
    saveMood: saveMood,
    deleteRecord: deleteRecord
  };
}])

.service('$sync', ['$connect', '$auth', '$localStorage', '$rootScope','$timeout','messenger', function($connect, $auth, $localStorage, $rootScope, $timeout, messenger) {
  var ref = $connect.ref;

  var doSync = function(key) {
    var data = $localStorage.getObject(key);
    if (data.length>0) {
      for (var i = data.length - 1; i >= 0; i--) {
        $localStorage.pop(key);
        ref.child('moodlogNumbers').child($auth.getUserData().uid).push(data[i], function(error) {
          if (error) {
            messenger.error('Aborting due to sync failure');
            throw new Error("error syncing", error, 'user data:', $auth.getUserData());
          } else {

          }
        });
      }
      messenger.success('Synced '+data.length+' records');
    }        
  };  

  var sync = function() {
    if ($auth.check()) {
      var createLocalCache = function(data) {
        $localStorage.setObject('moodCache', data)
      };

      ref.child('moodlogNumbers').child($auth.getUserData().uid).on('value', function(data) {
        createLocalCache(data.val());
      }, function(err) {
        console.log('failed to get mood data',err);
      });

      doSync($auth.uid+'offlineMoods');

      var unauthSync = function() {
        doSync('moods');
      };

      var unauthClear = function() {
        $localStorage.setObject('moods', []);
        $rootScope.$apply();
      };

      var unauthLength = $localStorage.length('moods');
      if (unauthLength) {
        $rootScope.$emit('unauthSync', unauthLength, unauthSync, unauthClear);
      };
    }
  };

  return {
    sync: sync,
    
  }
}]);

angular.module('utils', [])

.factory('$localStorage', ['$window','$rootScope', function($window, $rootScope) {
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
    },
    length: function(key) {
      var data = $window.localStorage[key];
      if (data) {
        data = JSON.parse(data);
      } else {
        data = [];
      }
      return data.length;      
    },
    pop: function(key) {
      var data = $window.localStorage[key];
      if (data) {
        data = JSON.parse(data);
        var index = data.length - 1;
        data.splice(index, 1);
      } else {
        data = [];
      }
      $window.localStorage[key] = JSON.stringify(data);
    }
  };
}])

.service('$connection', ['$sync', function($sync) {
  var connectedRef = new Firebase('https://moodtrackerapp.firebaseio.com/.info/connected');

  var status;

  connectedRef.on('value', function(snap) {
    if (snap.val()) {
      status = true;

      $sync.sync();
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