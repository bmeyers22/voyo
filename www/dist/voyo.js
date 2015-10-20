window.VOYO = angular.module('Voyo', ['ionic', 'firebase', 'Voyo.controllers', 'Voyo.services']);

VOYO.constant('FURL', 'https://voyo.firebaseio.com/');

VOYO.run(function($ionicPlatform, $rootScope, Auth) {
  return $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      return StatusBar.styleLightContent();
    }
  });
});

angular.module('Voyo.controllers', []);

angular.module('Voyo').run([
  '$rootScope', '$state', 'Auth', function($rootScope, $state, Auth) {
    Auth.auth.$onAuth(function(authData) {
      if (authData) {
        return Auth.user = authData;
      } else {
        if (Auth.user) {
          Auth.user = null;
        }
        return $state.go('login');
      }
    });
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      console.log('$stateChangeStart to ' + toState.to + '- fired when the transition begins. toState,toParams : \n', toState, toParams);
      if (toState.name === 'index') {
        if (toParams.currentAuth) {
          $state.go('tab.dash');
        } else {
          $state.go('login');
        }
        return event.preventDefault();
      }
    });
    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams) {
      console.log('$stateChangeError - fired when an error occurs during transition.');
      return console.log(arguments);
    });
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      return console.log('$stateChangeSuccess to ' + toState.name + '- fired once the state transition is complete.');
    });
    $rootScope.$on('$viewContentLoaded', function(event) {
      return console.log('$viewContentLoaded - fired after dom rendered', event);
    });
    $rootScope.$on('$stateNotFound', function(event, unfoundState, fromState, fromParams) {
      console.log('$stateNotFound ' + unfoundState.to + '  - fired when a state cannot be found by its name.');
      return console.log(unfoundState, fromState, fromParams);
    });
    return $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
      console.log('rejected');
      if (error === 'AUTH_REQUIRED') {
        return $state.go('login');
      }
    });
  }
]).config(function($stateProvider, $urlRouterProvider) {
  return $stateProvider.state('index', {
    url: '',
    resolve: {
      currentAuth: [
        'Auth', function(Auth) {
          return Auth.auth.$waitForAuth().then(function() {
            debugger;
          });
        }
      ]
    }
  }).state('login', {
    url: '/login',
    controller: 'LoginCtrl',
    templateUrl: 'templates/login.html',
    resolve: {
      currentAuth: [
        '$state', 'Auth', function($state, Auth) {
          return Auth.auth.$waitForAuth().then(function(obj) {
            if (obj != null) {
              return $state.go('tab.dash');
            }
          });
        }
      ]
    }
  }).state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html',
    resolve: {
      currentAuth: [
        'Auth', function(Auth) {
          return Auth.auth.$requireAuth();
        }
      ]
    }
  }).state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  }).state('tab.profile', {
    url: '/profile',
    views: {
      'tab-profile': {
        templateUrl: 'templates/tab-profile.html',
        controller: 'ProfileCtrl'
      }
    }
  });
});

angular.module('Voyo.services', []);

angular.module('Voyo.controllers').controller('DashCtrl', function($scope, Auth, Camera, currentAuth) {
  console.log(currentAuth);
  return $scope.getPhoto = function() {
    return Camera.getPicture().then(function(imageURI) {
      return console.log(imageURI);
    }, function(err) {
      return console.error(err);
    });
  };
});

angular.module('Voyo.controllers').controller('LoginCtrl', function($scope, Auth, $ionicPopup, $state, currentAuth) {
  var alertShow, errMessage;
  console.log(currentAuth);
  $scope.user = {
    email: '',
    password: ''
  };
  $scope.signIn = function() {
    return Auth.login($scope.user).then(function(result) {
      $scope.user = {
        email: '',
        password: ''
      };
      return $state.go('tab.dash');
    })["catch"](errMessage);
  };
  $scope.socialLogin = function(provider) {
    return Auth.socialLogin(provider);
  };
  $scope.createUser = function() {
    return Auth.register($scope.user)["catch"](errMessage);
  };
  alertShow = function(tit, msg) {
    var alertPopup;
    alertPopup = $ionicPopup.alert({
      title: tit,
      template: msg
    });
    return alertPopup.then(function(res) {});
  };
  errMessage = function(err) {
    var msg;
    if (err && err.code) {
      msg = (function() {
        switch (err.code) {
          case 'EMAIL_TAKEN':
            return 'This Email has been taken.';
          case 'INVALID_EMAIL':
            return 'Invalid Email.';
          case 'NETWORK_ERROR':
            return 'Network Error.';
          case 'INVALID_PASSWORD':
            return 'Invalid Password.';
          case 'INVALID_USER':
            return 'Invalid User.';
          default:
            return 'Unknown Error...';
        }
      })();
    }
    return alertShow('Error', msg);
  };
  if (Auth.signedIn()) {
    alertShow('Error', 'Already logged in');
  }
  return true;
});

angular.module('Voyo.controllers').controller('ProfileCtrl', function($scope, Auth, Camera, currentAuth) {
  console.log(currentAuth);
  return $scope.logout = function() {
    return Auth.logout();
  };
});

angular.module('Voyo').factory('Auth', function(FURL, $firebaseAuth, $firebaseArray, $firebaseObject, $state) {
  var ref;
  ref = new Firebase(FURL);
  return {
    auth: $firebaseAuth(ref),
    user: null,
    createProfile: function(uid, user) {
      var profile, usersRef;
      profile = {};
      profile[uid] = {
        id: uid,
        email: user.email,
        registeredAt: new Date()
      };
      usersRef = new Firebase("https://voyo.firebaseio.com/users/" + uid);
      return usersRef.set(profile);
    },
    createSocialProfile: function(uid, user) {
      var facebookProfile, fbRef, profile, usersRef;
      usersRef = new Firebase("https://voyo.firebaseio.com/users/" + uid);
      fbRef = new Firebase("https://voyo.firebaseio.com/facebookUsers/" + uid);
      profile = {
        id: uid,
        facebookUserId: user.facebook.id,
        email: user.facebook.email,
        firstName: user.facebook.cachedUserProfile.first_name,
        lastName: user.facebook.cachedUserProfile.last_name,
        registeredAt: new Date(),
        profileImageUrl: user.facebook.profileImageURL
      };
      facebookProfile = user.facebook;
      return usersRef.set(profile, function(ref) {
        return fbRef.set(facebookProfile);
      });
    },
    login: function(user) {
      return this.auth.$authWithPassword({
        email: user.email,
        password: user.password
      });
    },
    socialLogin: function(provider) {
      return this.auth.$authWithOAuthPopup(provider, {
        scope: 'user_birthday, user_location, user_about_me, email, public_profile'
      }).then((function(_this) {
        return function(authData) {
          var fbQueryRef;
          fbQueryRef = new Firebase("https://voyo.firebaseio.com/facebookUsers");
          return fbQueryRef.orderByChild("id").equalTo(authData.facebook.id).once('value', function(snapshot) {
            if (!(snapshot.numChildren() > 0)) {
              return _this.createSocialProfile(authData.uid, authData);
            } else {
              return $state.go('tab.dash');
            }
          });
        };
      })(this));
    },
    register: function(user) {
      return this.auth.$createUser({
        email: user.email,
        password: user.password
      }).then((function(_this) {
        return function() {
          return _this.login(user);
        };
      })(this)).then((function(_this) {
        return function(data) {
          return _this.createProfile(data.uid, user);
        };
      })(this));
    },
    logout: function() {
      return this.auth.$unauth();
    },
    resetpassword: function(user) {
      return this.auth.$resetPassword({
        email: user.email
      }).then(function() {
        return console.log('Password reset email sent successfully!');
      })["catch"](function(error) {
        return console.error('Error: ', error.message);
      });
    },
    changePassword: function(user) {
      return this.auth.$changePassword({
        email: user.email,
        oldPassword: user.oldPass,
        newPassword: user.newPass
      });
    },
    signedIn: function() {
      var ref1;
      return !!((ref1 = this.user) != null ? ref1.provider : void 0);
    }
  };
});

angular.module('Voyo.services').factory('Camera', [
  '$q', function($q) {
    return {
      getPicture: function(options) {
        var q;
        q = $q.defer();
        navigator.camera.getPicture(function(result) {
          return q.resolve(result);
        }, function(err) {
          return q.reject(err);
        }, options);
        return q.promise;
      }
    };
  }
]);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbnRyb2xsZXJzLmpzIiwicm91dGVyLmpzIiwic2VydmljZXMuanMiLCJjb250cm9sbGVycy9kYXNoYm9hcmQuanMiLCJjb250cm9sbGVycy9sb2dpbi5qcyIsImNvbnRyb2xsZXJzL3Byb2ZpbGUuanMiLCJzZXJ2aWNlcy9hdXRoLmpzIiwic2VydmljZXMvY2FtZXJhLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZkE7QUFDQTtBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwR0E7QUFDQTtBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJ2b3lvLmpzIiwic291cmNlc0NvbnRlbnQiOlsid2luZG93LlZPWU8gPSBhbmd1bGFyLm1vZHVsZSgnVm95bycsIFsnaW9uaWMnLCAnZmlyZWJhc2UnLCAnVm95by5jb250cm9sbGVycycsICdWb3lvLnNlcnZpY2VzJ10pO1xuXG5WT1lPLmNvbnN0YW50KCdGVVJMJywgJ2h0dHBzOi8vdm95by5maXJlYmFzZWlvLmNvbS8nKTtcblxuVk9ZTy5ydW4oZnVuY3Rpb24oJGlvbmljUGxhdGZvcm0sICRyb290U2NvcGUsIEF1dGgpIHtcbiAgcmV0dXJuICRpb25pY1BsYXRmb3JtLnJlYWR5KGZ1bmN0aW9uKCkge1xuICAgIGlmICh3aW5kb3cuY29yZG92YSAmJiB3aW5kb3cuY29yZG92YS5wbHVnaW5zICYmIHdpbmRvdy5jb3Jkb3ZhLnBsdWdpbnMuS2V5Ym9hcmQpIHtcbiAgICAgIGNvcmRvdmEucGx1Z2lucy5LZXlib2FyZC5oaWRlS2V5Ym9hcmRBY2Nlc3NvcnlCYXIodHJ1ZSk7XG4gICAgICBjb3Jkb3ZhLnBsdWdpbnMuS2V5Ym9hcmQuZGlzYWJsZVNjcm9sbCh0cnVlKTtcbiAgICB9XG4gICAgaWYgKHdpbmRvdy5TdGF0dXNCYXIpIHtcbiAgICAgIHJldHVybiBTdGF0dXNCYXIuc3R5bGVMaWdodENvbnRlbnQoKTtcbiAgICB9XG4gIH0pO1xufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnVm95by5jb250cm9sbGVycycsIFtdKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdWb3lvJykucnVuKFtcbiAgJyRyb290U2NvcGUnLCAnJHN0YXRlJywgJ0F1dGgnLCBmdW5jdGlvbigkcm9vdFNjb3BlLCAkc3RhdGUsIEF1dGgpIHtcbiAgICBBdXRoLmF1dGguJG9uQXV0aChmdW5jdGlvbihhdXRoRGF0YSkge1xuICAgICAgaWYgKGF1dGhEYXRhKSB7XG4gICAgICAgIHJldHVybiBBdXRoLnVzZXIgPSBhdXRoRGF0YTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChBdXRoLnVzZXIpIHtcbiAgICAgICAgICBBdXRoLnVzZXIgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAkc3RhdGUuZ28oJ2xvZ2luJyk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgJHJvb3RTY29wZS4kb24oJyRzdGF0ZUNoYW5nZVN0YXJ0JywgZnVuY3Rpb24oZXZlbnQsIHRvU3RhdGUsIHRvUGFyYW1zLCBmcm9tU3RhdGUsIGZyb21QYXJhbXMpIHtcbiAgICAgIGNvbnNvbGUubG9nKCckc3RhdGVDaGFuZ2VTdGFydCB0byAnICsgdG9TdGF0ZS50byArICctIGZpcmVkIHdoZW4gdGhlIHRyYW5zaXRpb24gYmVnaW5zLiB0b1N0YXRlLHRvUGFyYW1zIDogXFxuJywgdG9TdGF0ZSwgdG9QYXJhbXMpO1xuICAgICAgaWYgKHRvU3RhdGUubmFtZSA9PT0gJ2luZGV4Jykge1xuICAgICAgICBpZiAodG9QYXJhbXMuY3VycmVudEF1dGgpIHtcbiAgICAgICAgICAkc3RhdGUuZ28oJ3RhYi5kYXNoJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgJHN0YXRlLmdvKCdsb2dpbicpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgfVxuICAgIH0pO1xuICAgICRyb290U2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VFcnJvcicsIGZ1bmN0aW9uKGV2ZW50LCB0b1N0YXRlLCB0b1BhcmFtcywgZnJvbVN0YXRlLCBmcm9tUGFyYW1zKSB7XG4gICAgICBjb25zb2xlLmxvZygnJHN0YXRlQ2hhbmdlRXJyb3IgLSBmaXJlZCB3aGVuIGFuIGVycm9yIG9jY3VycyBkdXJpbmcgdHJhbnNpdGlvbi4nKTtcbiAgICAgIHJldHVybiBjb25zb2xlLmxvZyhhcmd1bWVudHMpO1xuICAgIH0pO1xuICAgICRyb290U2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdWNjZXNzJywgZnVuY3Rpb24oZXZlbnQsIHRvU3RhdGUsIHRvUGFyYW1zLCBmcm9tU3RhdGUsIGZyb21QYXJhbXMpIHtcbiAgICAgIHJldHVybiBjb25zb2xlLmxvZygnJHN0YXRlQ2hhbmdlU3VjY2VzcyB0byAnICsgdG9TdGF0ZS5uYW1lICsgJy0gZmlyZWQgb25jZSB0aGUgc3RhdGUgdHJhbnNpdGlvbiBpcyBjb21wbGV0ZS4nKTtcbiAgICB9KTtcbiAgICAkcm9vdFNjb3BlLiRvbignJHZpZXdDb250ZW50TG9hZGVkJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgIHJldHVybiBjb25zb2xlLmxvZygnJHZpZXdDb250ZW50TG9hZGVkIC0gZmlyZWQgYWZ0ZXIgZG9tIHJlbmRlcmVkJywgZXZlbnQpO1xuICAgIH0pO1xuICAgICRyb290U2NvcGUuJG9uKCckc3RhdGVOb3RGb3VuZCcsIGZ1bmN0aW9uKGV2ZW50LCB1bmZvdW5kU3RhdGUsIGZyb21TdGF0ZSwgZnJvbVBhcmFtcykge1xuICAgICAgY29uc29sZS5sb2coJyRzdGF0ZU5vdEZvdW5kICcgKyB1bmZvdW5kU3RhdGUudG8gKyAnICAtIGZpcmVkIHdoZW4gYSBzdGF0ZSBjYW5ub3QgYmUgZm91bmQgYnkgaXRzIG5hbWUuJyk7XG4gICAgICByZXR1cm4gY29uc29sZS5sb2codW5mb3VuZFN0YXRlLCBmcm9tU3RhdGUsIGZyb21QYXJhbXMpO1xuICAgIH0pO1xuICAgIHJldHVybiAkcm9vdFNjb3BlLiRvbignJHN0YXRlQ2hhbmdlRXJyb3InLCBmdW5jdGlvbihldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMsIGZyb21TdGF0ZSwgZnJvbVBhcmFtcywgZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdyZWplY3RlZCcpO1xuICAgICAgaWYgKGVycm9yID09PSAnQVVUSF9SRVFVSVJFRCcpIHtcbiAgICAgICAgcmV0dXJuICRzdGF0ZS5nbygnbG9naW4nKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXSkuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcbiAgcmV0dXJuICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdpbmRleCcsIHtcbiAgICB1cmw6ICcnLFxuICAgIHJlc29sdmU6IHtcbiAgICAgIGN1cnJlbnRBdXRoOiBbXG4gICAgICAgICdBdXRoJywgZnVuY3Rpb24oQXV0aCkge1xuICAgICAgICAgIHJldHVybiBBdXRoLmF1dGguJHdhaXRGb3JBdXRoKCkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGRlYnVnZ2VyO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICBdXG4gICAgfVxuICB9KS5zdGF0ZSgnbG9naW4nLCB7XG4gICAgdXJsOiAnL2xvZ2luJyxcbiAgICBjb250cm9sbGVyOiAnTG9naW5DdHJsJyxcbiAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9sb2dpbi5odG1sJyxcbiAgICByZXNvbHZlOiB7XG4gICAgICBjdXJyZW50QXV0aDogW1xuICAgICAgICAnJHN0YXRlJywgJ0F1dGgnLCBmdW5jdGlvbigkc3RhdGUsIEF1dGgpIHtcbiAgICAgICAgICByZXR1cm4gQXV0aC5hdXRoLiR3YWl0Rm9yQXV0aCgpLnRoZW4oZnVuY3Rpb24ob2JqKSB7XG4gICAgICAgICAgICBpZiAob2JqICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgcmV0dXJuICRzdGF0ZS5nbygndGFiLmRhc2gnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH1cbiAgfSkuc3RhdGUoJ3RhYicsIHtcbiAgICB1cmw6ICcvdGFiJyxcbiAgICBhYnN0cmFjdDogdHJ1ZSxcbiAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy90YWJzLmh0bWwnLFxuICAgIHJlc29sdmU6IHtcbiAgICAgIGN1cnJlbnRBdXRoOiBbXG4gICAgICAgICdBdXRoJywgZnVuY3Rpb24oQXV0aCkge1xuICAgICAgICAgIHJldHVybiBBdXRoLmF1dGguJHJlcXVpcmVBdXRoKCk7XG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9XG4gIH0pLnN0YXRlKCd0YWIuZGFzaCcsIHtcbiAgICB1cmw6ICcvZGFzaCcsXG4gICAgdmlld3M6IHtcbiAgICAgICd0YWItZGFzaCc6IHtcbiAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvdGFiLWRhc2guaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdEYXNoQ3RybCdcbiAgICAgIH1cbiAgICB9XG4gIH0pLnN0YXRlKCd0YWIucHJvZmlsZScsIHtcbiAgICB1cmw6ICcvcHJvZmlsZScsXG4gICAgdmlld3M6IHtcbiAgICAgICd0YWItcHJvZmlsZSc6IHtcbiAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvdGFiLXByb2ZpbGUuaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdQcm9maWxlQ3RybCdcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnVm95by5zZXJ2aWNlcycsIFtdKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdWb3lvLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignRGFzaEN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIEF1dGgsIENhbWVyYSwgY3VycmVudEF1dGgpIHtcbiAgY29uc29sZS5sb2coY3VycmVudEF1dGgpO1xuICByZXR1cm4gJHNjb3BlLmdldFBob3RvID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIENhbWVyYS5nZXRQaWN0dXJlKCkudGhlbihmdW5jdGlvbihpbWFnZVVSSSkge1xuICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKGltYWdlVVJJKTtcbiAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgIHJldHVybiBjb25zb2xlLmVycm9yKGVycik7XG4gICAgfSk7XG4gIH07XG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdWb3lvLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignTG9naW5DdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBBdXRoLCAkaW9uaWNQb3B1cCwgJHN0YXRlLCBjdXJyZW50QXV0aCkge1xuICB2YXIgYWxlcnRTaG93LCBlcnJNZXNzYWdlO1xuICBjb25zb2xlLmxvZyhjdXJyZW50QXV0aCk7XG4gICRzY29wZS51c2VyID0ge1xuICAgIGVtYWlsOiAnJyxcbiAgICBwYXNzd29yZDogJydcbiAgfTtcbiAgJHNjb3BlLnNpZ25JbiA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBBdXRoLmxvZ2luKCRzY29wZS51c2VyKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgJHNjb3BlLnVzZXIgPSB7XG4gICAgICAgIGVtYWlsOiAnJyxcbiAgICAgICAgcGFzc3dvcmQ6ICcnXG4gICAgICB9O1xuICAgICAgcmV0dXJuICRzdGF0ZS5nbygndGFiLmRhc2gnKTtcbiAgICB9KVtcImNhdGNoXCJdKGVyck1lc3NhZ2UpO1xuICB9O1xuICAkc2NvcGUuc29jaWFsTG9naW4gPSBmdW5jdGlvbihwcm92aWRlcikge1xuICAgIHJldHVybiBBdXRoLnNvY2lhbExvZ2luKHByb3ZpZGVyKTtcbiAgfTtcbiAgJHNjb3BlLmNyZWF0ZVVzZXIgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gQXV0aC5yZWdpc3Rlcigkc2NvcGUudXNlcilbXCJjYXRjaFwiXShlcnJNZXNzYWdlKTtcbiAgfTtcbiAgYWxlcnRTaG93ID0gZnVuY3Rpb24odGl0LCBtc2cpIHtcbiAgICB2YXIgYWxlcnRQb3B1cDtcbiAgICBhbGVydFBvcHVwID0gJGlvbmljUG9wdXAuYWxlcnQoe1xuICAgICAgdGl0bGU6IHRpdCxcbiAgICAgIHRlbXBsYXRlOiBtc2dcbiAgICB9KTtcbiAgICByZXR1cm4gYWxlcnRQb3B1cC50aGVuKGZ1bmN0aW9uKHJlcykge30pO1xuICB9O1xuICBlcnJNZXNzYWdlID0gZnVuY3Rpb24oZXJyKSB7XG4gICAgdmFyIG1zZztcbiAgICBpZiAoZXJyICYmIGVyci5jb2RlKSB7XG4gICAgICBtc2cgPSAoZnVuY3Rpb24oKSB7XG4gICAgICAgIHN3aXRjaCAoZXJyLmNvZGUpIHtcbiAgICAgICAgICBjYXNlICdFTUFJTF9UQUtFTic6XG4gICAgICAgICAgICByZXR1cm4gJ1RoaXMgRW1haWwgaGFzIGJlZW4gdGFrZW4uJztcbiAgICAgICAgICBjYXNlICdJTlZBTElEX0VNQUlMJzpcbiAgICAgICAgICAgIHJldHVybiAnSW52YWxpZCBFbWFpbC4nO1xuICAgICAgICAgIGNhc2UgJ05FVFdPUktfRVJST1InOlxuICAgICAgICAgICAgcmV0dXJuICdOZXR3b3JrIEVycm9yLic7XG4gICAgICAgICAgY2FzZSAnSU5WQUxJRF9QQVNTV09SRCc6XG4gICAgICAgICAgICByZXR1cm4gJ0ludmFsaWQgUGFzc3dvcmQuJztcbiAgICAgICAgICBjYXNlICdJTlZBTElEX1VTRVInOlxuICAgICAgICAgICAgcmV0dXJuICdJbnZhbGlkIFVzZXIuJztcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuICdVbmtub3duIEVycm9yLi4uJztcbiAgICAgICAgfVxuICAgICAgfSkoKTtcbiAgICB9XG4gICAgcmV0dXJuIGFsZXJ0U2hvdygnRXJyb3InLCBtc2cpO1xuICB9O1xuICBpZiAoQXV0aC5zaWduZWRJbigpKSB7XG4gICAgYWxlcnRTaG93KCdFcnJvcicsICdBbHJlYWR5IGxvZ2dlZCBpbicpO1xuICB9XG4gIHJldHVybiB0cnVlO1xufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnVm95by5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1Byb2ZpbGVDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBBdXRoLCBDYW1lcmEsIGN1cnJlbnRBdXRoKSB7XG4gIGNvbnNvbGUubG9nKGN1cnJlbnRBdXRoKTtcbiAgcmV0dXJuICRzY29wZS5sb2dvdXQgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gQXV0aC5sb2dvdXQoKTtcbiAgfTtcbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ1ZveW8nKS5mYWN0b3J5KCdBdXRoJywgZnVuY3Rpb24oRlVSTCwgJGZpcmViYXNlQXV0aCwgJGZpcmViYXNlQXJyYXksICRmaXJlYmFzZU9iamVjdCwgJHN0YXRlKSB7XG4gIHZhciByZWY7XG4gIHJlZiA9IG5ldyBGaXJlYmFzZShGVVJMKTtcbiAgcmV0dXJuIHtcbiAgICBhdXRoOiAkZmlyZWJhc2VBdXRoKHJlZiksXG4gICAgdXNlcjogbnVsbCxcbiAgICBjcmVhdGVQcm9maWxlOiBmdW5jdGlvbih1aWQsIHVzZXIpIHtcbiAgICAgIHZhciBwcm9maWxlLCB1c2Vyc1JlZjtcbiAgICAgIHByb2ZpbGUgPSB7fTtcbiAgICAgIHByb2ZpbGVbdWlkXSA9IHtcbiAgICAgICAgaWQ6IHVpZCxcbiAgICAgICAgZW1haWw6IHVzZXIuZW1haWwsXG4gICAgICAgIHJlZ2lzdGVyZWRBdDogbmV3IERhdGUoKVxuICAgICAgfTtcbiAgICAgIHVzZXJzUmVmID0gbmV3IEZpcmViYXNlKFwiaHR0cHM6Ly92b3lvLmZpcmViYXNlaW8uY29tL3VzZXJzL1wiICsgdWlkKTtcbiAgICAgIHJldHVybiB1c2Vyc1JlZi5zZXQocHJvZmlsZSk7XG4gICAgfSxcbiAgICBjcmVhdGVTb2NpYWxQcm9maWxlOiBmdW5jdGlvbih1aWQsIHVzZXIpIHtcbiAgICAgIHZhciBmYWNlYm9va1Byb2ZpbGUsIGZiUmVmLCBwcm9maWxlLCB1c2Vyc1JlZjtcbiAgICAgIHVzZXJzUmVmID0gbmV3IEZpcmViYXNlKFwiaHR0cHM6Ly92b3lvLmZpcmViYXNlaW8uY29tL3VzZXJzL1wiICsgdWlkKTtcbiAgICAgIGZiUmVmID0gbmV3IEZpcmViYXNlKFwiaHR0cHM6Ly92b3lvLmZpcmViYXNlaW8uY29tL2ZhY2Vib29rVXNlcnMvXCIgKyB1aWQpO1xuICAgICAgcHJvZmlsZSA9IHtcbiAgICAgICAgaWQ6IHVpZCxcbiAgICAgICAgZmFjZWJvb2tVc2VySWQ6IHVzZXIuZmFjZWJvb2suaWQsXG4gICAgICAgIGVtYWlsOiB1c2VyLmZhY2Vib29rLmVtYWlsLFxuICAgICAgICBmaXJzdE5hbWU6IHVzZXIuZmFjZWJvb2suY2FjaGVkVXNlclByb2ZpbGUuZmlyc3RfbmFtZSxcbiAgICAgICAgbGFzdE5hbWU6IHVzZXIuZmFjZWJvb2suY2FjaGVkVXNlclByb2ZpbGUubGFzdF9uYW1lLFxuICAgICAgICByZWdpc3RlcmVkQXQ6IG5ldyBEYXRlKCksXG4gICAgICAgIHByb2ZpbGVJbWFnZVVybDogdXNlci5mYWNlYm9vay5wcm9maWxlSW1hZ2VVUkxcbiAgICAgIH07XG4gICAgICBmYWNlYm9va1Byb2ZpbGUgPSB1c2VyLmZhY2Vib29rO1xuICAgICAgcmV0dXJuIHVzZXJzUmVmLnNldChwcm9maWxlLCBmdW5jdGlvbihyZWYpIHtcbiAgICAgICAgcmV0dXJuIGZiUmVmLnNldChmYWNlYm9va1Byb2ZpbGUpO1xuICAgICAgfSk7XG4gICAgfSxcbiAgICBsb2dpbjogZnVuY3Rpb24odXNlcikge1xuICAgICAgcmV0dXJuIHRoaXMuYXV0aC4kYXV0aFdpdGhQYXNzd29yZCh7XG4gICAgICAgIGVtYWlsOiB1c2VyLmVtYWlsLFxuICAgICAgICBwYXNzd29yZDogdXNlci5wYXNzd29yZFxuICAgICAgfSk7XG4gICAgfSxcbiAgICBzb2NpYWxMb2dpbjogZnVuY3Rpb24ocHJvdmlkZXIpIHtcbiAgICAgIHJldHVybiB0aGlzLmF1dGguJGF1dGhXaXRoT0F1dGhQb3B1cChwcm92aWRlciwge1xuICAgICAgICBzY29wZTogJ3VzZXJfYmlydGhkYXksIHVzZXJfbG9jYXRpb24sIHVzZXJfYWJvdXRfbWUsIGVtYWlsLCBwdWJsaWNfcHJvZmlsZSdcbiAgICAgIH0pLnRoZW4oKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihhdXRoRGF0YSkge1xuICAgICAgICAgIHZhciBmYlF1ZXJ5UmVmO1xuICAgICAgICAgIGZiUXVlcnlSZWYgPSBuZXcgRmlyZWJhc2UoXCJodHRwczovL3ZveW8uZmlyZWJhc2Vpby5jb20vZmFjZWJvb2tVc2Vyc1wiKTtcbiAgICAgICAgICByZXR1cm4gZmJRdWVyeVJlZi5vcmRlckJ5Q2hpbGQoXCJpZFwiKS5lcXVhbFRvKGF1dGhEYXRhLmZhY2Vib29rLmlkKS5vbmNlKCd2YWx1ZScsIGZ1bmN0aW9uKHNuYXBzaG90KSB7XG4gICAgICAgICAgICBpZiAoIShzbmFwc2hvdC5udW1DaGlsZHJlbigpID4gMCkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIF90aGlzLmNyZWF0ZVNvY2lhbFByb2ZpbGUoYXV0aERhdGEudWlkLCBhdXRoRGF0YSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4gJHN0YXRlLmdvKCd0YWIuZGFzaCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgfSkodGhpcykpO1xuICAgIH0sXG4gICAgcmVnaXN0ZXI6IGZ1bmN0aW9uKHVzZXIpIHtcbiAgICAgIHJldHVybiB0aGlzLmF1dGguJGNyZWF0ZVVzZXIoe1xuICAgICAgICBlbWFpbDogdXNlci5lbWFpbCxcbiAgICAgICAgcGFzc3dvcmQ6IHVzZXIucGFzc3dvcmRcbiAgICAgIH0pLnRoZW4oKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gX3RoaXMubG9naW4odXNlcik7XG4gICAgICAgIH07XG4gICAgICB9KSh0aGlzKSkudGhlbigoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICByZXR1cm4gX3RoaXMuY3JlYXRlUHJvZmlsZShkYXRhLnVpZCwgdXNlcik7XG4gICAgICAgIH07XG4gICAgICB9KSh0aGlzKSk7XG4gICAgfSxcbiAgICBsb2dvdXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuYXV0aC4kdW5hdXRoKCk7XG4gICAgfSxcbiAgICByZXNldHBhc3N3b3JkOiBmdW5jdGlvbih1c2VyKSB7XG4gICAgICByZXR1cm4gdGhpcy5hdXRoLiRyZXNldFBhc3N3b3JkKHtcbiAgICAgICAgZW1haWw6IHVzZXIuZW1haWxcbiAgICAgIH0pLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBjb25zb2xlLmxvZygnUGFzc3dvcmQgcmVzZXQgZW1haWwgc2VudCBzdWNjZXNzZnVsbHkhJyk7XG4gICAgICB9KVtcImNhdGNoXCJdKGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgIHJldHVybiBjb25zb2xlLmVycm9yKCdFcnJvcjogJywgZXJyb3IubWVzc2FnZSk7XG4gICAgICB9KTtcbiAgICB9LFxuICAgIGNoYW5nZVBhc3N3b3JkOiBmdW5jdGlvbih1c2VyKSB7XG4gICAgICByZXR1cm4gdGhpcy5hdXRoLiRjaGFuZ2VQYXNzd29yZCh7XG4gICAgICAgIGVtYWlsOiB1c2VyLmVtYWlsLFxuICAgICAgICBvbGRQYXNzd29yZDogdXNlci5vbGRQYXNzLFxuICAgICAgICBuZXdQYXNzd29yZDogdXNlci5uZXdQYXNzXG4gICAgICB9KTtcbiAgICB9LFxuICAgIHNpZ25lZEluOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciByZWYxO1xuICAgICAgcmV0dXJuICEhKChyZWYxID0gdGhpcy51c2VyKSAhPSBudWxsID8gcmVmMS5wcm92aWRlciA6IHZvaWQgMCk7XG4gICAgfVxuICB9O1xufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnVm95by5zZXJ2aWNlcycpLmZhY3RvcnkoJ0NhbWVyYScsIFtcbiAgJyRxJywgZnVuY3Rpb24oJHEpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZ2V0UGljdHVyZTogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgICB2YXIgcTtcbiAgICAgICAgcSA9ICRxLmRlZmVyKCk7XG4gICAgICAgIG5hdmlnYXRvci5jYW1lcmEuZ2V0UGljdHVyZShmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgICByZXR1cm4gcS5yZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgIHJldHVybiBxLnJlamVjdChlcnIpO1xuICAgICAgICB9LCBvcHRpb25zKTtcbiAgICAgICAgcmV0dXJuIHEucHJvbWlzZTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5dKTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
