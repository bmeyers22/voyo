// // Ionic Starter App
//
// // angular.module is a global place for creating, registering and retrieving Angular modules
// // 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// // the 2nd parameter is an array of 'requires'
// // 'starter.services' is found in services.js
// // 'starter.controllers' is found in controllers.js
'use strict';

window.VOYO = angular.module('Voyo', ['ionic', 'firebase', 'Voyo.controllers', 'Voyo.services', 'templates']);

VOYO.constant('FIREBASE_URL', 'https://voyo.firebaseio.com/');
VOYO.run(function ($ionicPlatform, $rootScope, Auth) {
  $ionicPlatform.ready(function () {
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }

    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
});
'use strict';

angular.module('Voyo').run(['$rootScope', '$state', 'Auth', function ($rootScope, $state, Auth) {

  Auth.auth.$onAuth(function (authData) {
    if (authData) {
      Auth.user = authData;
    } else {
      if (Auth.user) {
        Auth.user = null;
      }
      $state.go('login');
    }
  });

  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    console.log('$stateChangeStart to ' + toState.to + '- fired when the transition begins. toState,toParams : \n', toState, toParams);
    if (toState.name === 'index') {
      if (toParams.currentAuth) {
        $state.go('app.dash');
      } else {
        $state.go('login');
      }
      event.preventDefault();
    }
  });

  // $rootScope.$on '$stateChangeError',(event, toState, toParams, fromState, fromParams) ->
  //   console.log('$stateChangeError - fired when an error occurs during transition.')
  //   console.log(arguments)
  //
  // $rootScope.$on '$stateChangeSuccess',(event, toState, toParams, fromState, fromParams) ->
  //   console.log('$stateChangeSuccess to '+toState.name+'- fired once the state transition is complete.')
  // $rootScope.$on '$viewContentLoaded',(event) ->
  //   console.log('$viewContentLoaded - fired after dom rendered',event)
  //
  // $rootScope.$on '$stateNotFound',(event, unfoundState, fromState, fromParams) ->
  //   console.log('$stateNotFound '+unfoundState.to+'  - fired when a state cannot be found by its name.')
  //   console.log(unfoundState, fromState, fromParams)

  $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
    console.log('rejected');
    // # We can catch the error thrown when the $requireAuth promise is rejected
    // # and redirect the user back to the home page
    if (error === 'AUTH_REQUIRED') {
      $state.go('login');
    }
  });
}]).config(function ($stateProvider, $urlRouterProvider) {
  // # Ionic uses AngularUI Router which uses the concept of states
  // # Learn more here: https:#github.com/angular-ui/ui-router
  // # Set up the various states which the app can be in.
  // # Each state's controller can be found in controllers.js
  $stateProvider.state('index', {
    url: '',
    resolve: {
      currentAuth: ['Auth', function (Auth) {
        // # $waitForAuth returns a promise so the resolve waits for it to complete
        Auth.auth.$waitForAuth().then(function () {});
      }]
    }
  }).state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'app/template.html',
    resolve: {
      currentAuth: ['Auth', function (Auth) {
        // # $requireAuth returns a promise so the resolve waits for it to complete
        // # If the promise is rejected, it will throw a $stateChangeError (see above)
        return Auth.auth.$requireAuth();
      }]
    }
  });
});
'use strict';

angular.module('Voyo.controllers', []);
'use strict';

angular.module('Voyo.services', []);
'use strict';

angular.module('templates', []);
'use strict';

angular.module('Voyo.controllers').controller('DashboardController', function ($scope, Auth, Camera, currentUser) {
  $scope.currentUser = currentUser;
  $scope.getPhoto = function () {
    Camera.getPicture().then(function (imageURI) {
      console.log(imageURI);
    }, function (err) {
      console.error(err);
    });
  };
});
'use strict';

angular.module('Voyo').config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider.state('app.dash', {
    url: '/dash',
    views: {
      'app-dash': {
        templateUrl: 'dashboard/template.html',
        controller: 'DashboardController'
      }
    },
    resolve: {
      currentUser: ['$state', 'Auth', 'User', 'currentAuth', function ($state, Auth, User, currentAuth) {
        return User(currentAuth.uid).$loaded();
      }]
    }
  });
});
'use strict';

angular.module('Voyo.controllers').controller('LoginController', function ($scope, Auth, $ionicPopup, $state, currentAuth) {

  console.log(currentAuth);
  $scope.user = {
    email: '',
    password: ''
  };

  $scope.signIn = function () {
    Auth.login($scope.user).then(function (result) {
      $scope.user = {
        email: '',
        password: ''
      };
      $state.go('app.dash');
    })['catch'](errMessage);
  };

  $scope.socialLogin = function (provider) {
    Auth.socialLogin(provider);
  };

  $scope.createUser = function () {
    Auth.register($scope.user)['catch'](errMessage);
  };

  var alertShow = function alertShow(tit, msg) {
    $ionicPopup.alert({
      title: tit,
      template: msg
    }).then(function (res) {});
  };

  var errMessage = function errMessage(err) {};
  // if err and err.code
  //   msg = switch err.code
  //     when 'EMAIL_TAKEN' then 'This Email has been taken.'
  //     when 'INVALID_EMAIL' then 'Invalid Email.'
  //     when 'NETWORK_ERROR' then 'Network Error.'
  //     when 'INVALID_PASSWORD' then 'Invalid Password.'
  //     when 'INVALID_USER' then 'Invalid User.'
  //     else 'Unknown Error...'
  // alertShow 'Error', msg
});
'use strict';

angular.module('Voyo').config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider.state('login', {
    url: '/login',
    controller: 'LoginController',
    templateUrl: 'login/template.html',
    resolve: {
      currentAuth: ['$state', 'Auth', function ($state, Auth) {
        // $waitForAuth returns a promise so the resolve waits for it to complete
        return Auth.auth.$waitForAuth().then(function (obj) {
          if (obj != null) {
            $state.go('app.dash');
          }
        });
      }]
    }
  });
});
"use strict";

angular.module('Voyo').factory("User", ["$firebaseObject", 'FIREBASE_URL', function ($firebaseObject, FIREBASE_URL) {
  // create a new service based on $firebaseObject
  var User = $firebaseObject.$extend({
    // these methods exist on the prototype, so we can access the data using `this`
    getFullName: function getFullName() {
      return this.firstName + " " + this.lastName;
    }
  });
  return function (userId) {
    var ref = new Firebase(FIREBASE_URL + "users/").child(userId);
    // create an instance of User (the new operator is required)
    return new User(ref);
  };
}]);
'use strict';

angular.module('Voyo.controllers').controller('ProfileController', function ($scope, Auth, Camera, currentAuth) {
  console.log(currentAuth);
  $scope.logout = function () {
    Auth.logout();
  };
});
'use strict';

angular.module('Voyo').config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider.state('app.profile', {
    url: '/profile',
    views: {
      'app-profile': {
        templateUrl: 'profile/template.html',
        controller: 'ProfileController'
      }
    }
  });
});
'use strict';

angular.module('Voyo').factory('Auth', function (FIREBASE_URL, $firebaseAuth, $firebaseArray, $firebaseObject, $state, UserService) {
  var ref = new Firebase(FIREBASE_URL);

  return {
    auth: $firebaseAuth(ref),
    user: null,

    createSocialProfile: function createSocialProfile(uid, user) {
      var usersRef = new Firebase('https://voyo.firebaseio.com/users/' + uid),
          fbRef = new Firebase('https://voyo.firebaseio.com/facebookUsers/' + uid),
          profile = {
        id: uid,
        facebookUserId: user.facebook.id,
        email: user.facebook.email,
        firstName: user.facebook.cachedUserProfile.first_name,
        lastName: user.facebook.cachedUserProfile.last_name,
        registeredAt: new Date(),
        profileImageUrl: user.facebook.profileImageURL
      },
          facebookProfile = user.facebook;

      return usersRef.set(profile, function (ref) {
        fbRef.set(facebookProfile);
      });
    },

    login: function login(user) {
      return this.auth.$authWithPassword({
        email: user.email,
        password: user.password
      });
    },

    socialLogin: function socialLogin(provider) {
      var _this = this;

      return this.auth.$authWithOAuthPopup(provider, {
        scope: 'user_birthday, user_location, user_about_me, email, public_profile'
      }).then(function (authData) {
        var fbQueryRef = new Firebase("https://voyo.firebaseio.com/facebookUsers");
        return fbQueryRef.orderByChild("id").equalTo(authData.facebook.id).once('value', function (snapshot) {
          if (snapshot.numChildren() === 0) {
            _this.createSocialProfile(authData.uid, authData);
          } else {
            $state.go('app.dash');
          }
        });
      });
    },

    register: function register(user) {
      var _this2 = this;

      return this.auth.$createUser({
        email: user.email,
        password: user.password
      }).then(function () {
        //  authenticate so we have permission to write to Firebase
        return _this2.login(user);
      }).then(function (data) {
        //  store user data in Firebase after creating account
        // console.log('datos del usuario:' + JSON.stringify(data))
        return UserService.createProfile(data.uid, user);
      })['catch'](function (error) {
        console.log(error);
      });
    },

    logout: function logout() {
      return this.auth.$unauth();
    },

    resetpassword: function resetpassword(user) {
      return this.auth.$resetPassword({
        email: user.email
      }).then(function () {
        console.log('Password reset email sent successfully!');
      })['catch'](function (error) {
        console.error('Error: ', error.message);
      });
    },

    changePassword: function changePassword(user) {
      return this.auth.$changePassword({
        email: user.email,
        oldPassword: user.oldPass,
        newPassword: user.newPass
      });
    },

    signedIn: function signedIn() {
      return !!this.user;
    }
  };
});
'use strict';

angular.module('Voyo.services').factory('Camera', ['$q', function ($q) {
  return {
    getPicture: function getPicture(options) {
      var q = $q.defer();

      navigator.camera.getPicture(function (result) {
        q.resolve(result);
      }, function (err) {
        q.reject(err);
      }, options);

      return q.promise;
    }
  };
}]);
'use strict';

angular.module('Voyo.services').service('UserService', function (User) {
  this.createProfile = function (uid, user) {
    var profile = {
      id: uid,
      email: user.email,
      registeredAt: new Date()
    };

    var usersRef = User(uid);
    return usersRef.set(profile);
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsInJvdXRlci5qcyIsImNvbnRyb2xsZXJzLmpzIiwic2VydmljZXMuanMiLCJ0ZW1wbGF0ZXMuanMiLCJkYXNoYm9hcmQvY29udHJvbGxlci5qcyIsImRhc2hib2FyZC9yb3V0ZS5qcyIsImxvZ2luL2NvbnRyb2xsZXIuanMiLCJsb2dpbi9yb3V0ZS5qcyIsIm1vZGVscy91c2VyLmpzIiwicHJvZmlsZS9jb250cm9sbGVyLmpzIiwicHJvZmlsZS9yb3V0ZS5qcyIsInNlcnZpY2VzL2F1dGguanMiLCJzZXJ2aWNlcy9jYW1lcmEuanMiLCJzZXJ2aWNlcy91c2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6RUE7QUFDQTtBQUNBO0FDRkE7QUFDQTtBQUNBO0FDRkE7QUFDQTtBQUNBO0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6InZveW8uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyAvLyBJb25pYyBTdGFydGVyIEFwcFxuLy9cbi8vIC8vIGFuZ3VsYXIubW9kdWxlIGlzIGEgZ2xvYmFsIHBsYWNlIGZvciBjcmVhdGluZywgcmVnaXN0ZXJpbmcgYW5kIHJldHJpZXZpbmcgQW5ndWxhciBtb2R1bGVzXG4vLyAvLyAnc3RhcnRlcicgaXMgdGhlIG5hbWUgb2YgdGhpcyBhbmd1bGFyIG1vZHVsZSBleGFtcGxlIChhbHNvIHNldCBpbiBhIDxib2R5PiBhdHRyaWJ1dGUgaW4gaW5kZXguaHRtbClcbi8vIC8vIHRoZSAybmQgcGFyYW1ldGVyIGlzIGFuIGFycmF5IG9mICdyZXF1aXJlcydcbi8vIC8vICdzdGFydGVyLnNlcnZpY2VzJyBpcyBmb3VuZCBpbiBzZXJ2aWNlcy5qc1xuLy8gLy8gJ3N0YXJ0ZXIuY29udHJvbGxlcnMnIGlzIGZvdW5kIGluIGNvbnRyb2xsZXJzLmpzXG4ndXNlIHN0cmljdCc7XG5cbndpbmRvdy5WT1lPID0gYW5ndWxhci5tb2R1bGUoJ1ZveW8nLCBbJ2lvbmljJywgJ2ZpcmViYXNlJywgJ1ZveW8uY29udHJvbGxlcnMnLCAnVm95by5zZXJ2aWNlcycsICd0ZW1wbGF0ZXMnXSk7XG5cblZPWU8uY29uc3RhbnQoJ0ZJUkVCQVNFX1VSTCcsICdodHRwczovL3ZveW8uZmlyZWJhc2Vpby5jb20vJyk7XG5WT1lPLnJ1bihmdW5jdGlvbiAoJGlvbmljUGxhdGZvcm0sICRyb290U2NvcGUsIEF1dGgpIHtcbiAgJGlvbmljUGxhdGZvcm0ucmVhZHkoZnVuY3Rpb24gKCkge1xuICAgIGlmICh3aW5kb3cuY29yZG92YSAmJiB3aW5kb3cuY29yZG92YS5wbHVnaW5zICYmIHdpbmRvdy5jb3Jkb3ZhLnBsdWdpbnMuS2V5Ym9hcmQpIHtcbiAgICAgIGNvcmRvdmEucGx1Z2lucy5LZXlib2FyZC5oaWRlS2V5Ym9hcmRBY2Nlc3NvcnlCYXIodHJ1ZSk7XG4gICAgICBjb3Jkb3ZhLnBsdWdpbnMuS2V5Ym9hcmQuZGlzYWJsZVNjcm9sbCh0cnVlKTtcbiAgICB9XG5cbiAgICBpZiAod2luZG93LlN0YXR1c0Jhcikge1xuICAgICAgLy8gb3JnLmFwYWNoZS5jb3Jkb3ZhLnN0YXR1c2JhciByZXF1aXJlZFxuICAgICAgU3RhdHVzQmFyLnN0eWxlTGlnaHRDb250ZW50KCk7XG4gICAgfVxuICB9KTtcbn0pOyIsIid1c2Ugc3RyaWN0JztcblxuYW5ndWxhci5tb2R1bGUoJ1ZveW8nKS5ydW4oWyckcm9vdFNjb3BlJywgJyRzdGF0ZScsICdBdXRoJywgZnVuY3Rpb24gKCRyb290U2NvcGUsICRzdGF0ZSwgQXV0aCkge1xuXG4gIEF1dGguYXV0aC4kb25BdXRoKGZ1bmN0aW9uIChhdXRoRGF0YSkge1xuICAgIGlmIChhdXRoRGF0YSkge1xuICAgICAgQXV0aC51c2VyID0gYXV0aERhdGE7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChBdXRoLnVzZXIpIHtcbiAgICAgICAgQXV0aC51c2VyID0gbnVsbDtcbiAgICAgIH1cbiAgICAgICRzdGF0ZS5nbygnbG9naW4nKTtcbiAgICB9XG4gIH0pO1xuXG4gICRyb290U2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdGFydCcsIGZ1bmN0aW9uIChldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMsIGZyb21TdGF0ZSwgZnJvbVBhcmFtcykge1xuICAgIGNvbnNvbGUubG9nKCckc3RhdGVDaGFuZ2VTdGFydCB0byAnICsgdG9TdGF0ZS50byArICctIGZpcmVkIHdoZW4gdGhlIHRyYW5zaXRpb24gYmVnaW5zLiB0b1N0YXRlLHRvUGFyYW1zIDogXFxuJywgdG9TdGF0ZSwgdG9QYXJhbXMpO1xuICAgIGlmICh0b1N0YXRlLm5hbWUgPT09ICdpbmRleCcpIHtcbiAgICAgIGlmICh0b1BhcmFtcy5jdXJyZW50QXV0aCkge1xuICAgICAgICAkc3RhdGUuZ28oJ2FwcC5kYXNoJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkc3RhdGUuZ28oJ2xvZ2luJyk7XG4gICAgICB9XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cbiAgfSk7XG5cbiAgLy8gJHJvb3RTY29wZS4kb24gJyRzdGF0ZUNoYW5nZUVycm9yJywoZXZlbnQsIHRvU3RhdGUsIHRvUGFyYW1zLCBmcm9tU3RhdGUsIGZyb21QYXJhbXMpIC0+XG4gIC8vICAgY29uc29sZS5sb2coJyRzdGF0ZUNoYW5nZUVycm9yIC0gZmlyZWQgd2hlbiBhbiBlcnJvciBvY2N1cnMgZHVyaW5nIHRyYW5zaXRpb24uJylcbiAgLy8gICBjb25zb2xlLmxvZyhhcmd1bWVudHMpXG4gIC8vXG4gIC8vICRyb290U2NvcGUuJG9uICckc3RhdGVDaGFuZ2VTdWNjZXNzJywoZXZlbnQsIHRvU3RhdGUsIHRvUGFyYW1zLCBmcm9tU3RhdGUsIGZyb21QYXJhbXMpIC0+XG4gIC8vICAgY29uc29sZS5sb2coJyRzdGF0ZUNoYW5nZVN1Y2Nlc3MgdG8gJyt0b1N0YXRlLm5hbWUrJy0gZmlyZWQgb25jZSB0aGUgc3RhdGUgdHJhbnNpdGlvbiBpcyBjb21wbGV0ZS4nKVxuICAvLyAkcm9vdFNjb3BlLiRvbiAnJHZpZXdDb250ZW50TG9hZGVkJywoZXZlbnQpIC0+XG4gIC8vICAgY29uc29sZS5sb2coJyR2aWV3Q29udGVudExvYWRlZCAtIGZpcmVkIGFmdGVyIGRvbSByZW5kZXJlZCcsZXZlbnQpXG4gIC8vXG4gIC8vICRyb290U2NvcGUuJG9uICckc3RhdGVOb3RGb3VuZCcsKGV2ZW50LCB1bmZvdW5kU3RhdGUsIGZyb21TdGF0ZSwgZnJvbVBhcmFtcykgLT5cbiAgLy8gICBjb25zb2xlLmxvZygnJHN0YXRlTm90Rm91bmQgJyt1bmZvdW5kU3RhdGUudG8rJyAgLSBmaXJlZCB3aGVuIGEgc3RhdGUgY2Fubm90IGJlIGZvdW5kIGJ5IGl0cyBuYW1lLicpXG4gIC8vICAgY29uc29sZS5sb2codW5mb3VuZFN0YXRlLCBmcm9tU3RhdGUsIGZyb21QYXJhbXMpXG5cbiAgJHJvb3RTY29wZS4kb24oJyRzdGF0ZUNoYW5nZUVycm9yJywgZnVuY3Rpb24gKGV2ZW50LCB0b1N0YXRlLCB0b1BhcmFtcywgZnJvbVN0YXRlLCBmcm9tUGFyYW1zLCBlcnJvcikge1xuICAgIGNvbnNvbGUubG9nKCdyZWplY3RlZCcpO1xuICAgIC8vICMgV2UgY2FuIGNhdGNoIHRoZSBlcnJvciB0aHJvd24gd2hlbiB0aGUgJHJlcXVpcmVBdXRoIHByb21pc2UgaXMgcmVqZWN0ZWRcbiAgICAvLyAjIGFuZCByZWRpcmVjdCB0aGUgdXNlciBiYWNrIHRvIHRoZSBob21lIHBhZ2VcbiAgICBpZiAoZXJyb3IgPT09ICdBVVRIX1JFUVVJUkVEJykge1xuICAgICAgJHN0YXRlLmdvKCdsb2dpbicpO1xuICAgIH1cbiAgfSk7XG59XSkuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gIC8vICMgSW9uaWMgdXNlcyBBbmd1bGFyVUkgUm91dGVyIHdoaWNoIHVzZXMgdGhlIGNvbmNlcHQgb2Ygc3RhdGVzXG4gIC8vICMgTGVhcm4gbW9yZSBoZXJlOiBodHRwczojZ2l0aHViLmNvbS9hbmd1bGFyLXVpL3VpLXJvdXRlclxuICAvLyAjIFNldCB1cCB0aGUgdmFyaW91cyBzdGF0ZXMgd2hpY2ggdGhlIGFwcCBjYW4gYmUgaW4uXG4gIC8vICMgRWFjaCBzdGF0ZSdzIGNvbnRyb2xsZXIgY2FuIGJlIGZvdW5kIGluIGNvbnRyb2xsZXJzLmpzXG4gICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdpbmRleCcsIHtcbiAgICB1cmw6ICcnLFxuICAgIHJlc29sdmU6IHtcbiAgICAgIGN1cnJlbnRBdXRoOiBbJ0F1dGgnLCBmdW5jdGlvbiAoQXV0aCkge1xuICAgICAgICAvLyAjICR3YWl0Rm9yQXV0aCByZXR1cm5zIGEgcHJvbWlzZSBzbyB0aGUgcmVzb2x2ZSB3YWl0cyBmb3IgaXQgdG8gY29tcGxldGVcbiAgICAgICAgQXV0aC5hdXRoLiR3YWl0Rm9yQXV0aCgpLnRoZW4oZnVuY3Rpb24gKCkge30pO1xuICAgICAgfV1cbiAgICB9XG4gIH0pLnN0YXRlKCdhcHAnLCB7XG4gICAgdXJsOiAnL2FwcCcsXG4gICAgYWJzdHJhY3Q6IHRydWUsXG4gICAgdGVtcGxhdGVVcmw6ICdhcHAvdGVtcGxhdGUuaHRtbCcsXG4gICAgcmVzb2x2ZToge1xuICAgICAgY3VycmVudEF1dGg6IFsnQXV0aCcsIGZ1bmN0aW9uIChBdXRoKSB7XG4gICAgICAgIC8vICMgJHJlcXVpcmVBdXRoIHJldHVybnMgYSBwcm9taXNlIHNvIHRoZSByZXNvbHZlIHdhaXRzIGZvciBpdCB0byBjb21wbGV0ZVxuICAgICAgICAvLyAjIElmIHRoZSBwcm9taXNlIGlzIHJlamVjdGVkLCBpdCB3aWxsIHRocm93IGEgJHN0YXRlQ2hhbmdlRXJyb3IgKHNlZSBhYm92ZSlcbiAgICAgICAgcmV0dXJuIEF1dGguYXV0aC4kcmVxdWlyZUF1dGgoKTtcbiAgICAgIH1dXG4gICAgfVxuICB9KTtcbn0pOyIsIid1c2Ugc3RyaWN0JztcblxuYW5ndWxhci5tb2R1bGUoJ1ZveW8uY29udHJvbGxlcnMnLCBbXSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG5hbmd1bGFyLm1vZHVsZSgnVm95by5zZXJ2aWNlcycsIFtdKTsiLCIndXNlIHN0cmljdCc7XG5cbmFuZ3VsYXIubW9kdWxlKCd0ZW1wbGF0ZXMnLCBbXSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG5hbmd1bGFyLm1vZHVsZSgnVm95by5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0Rhc2hib2FyZENvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCBBdXRoLCBDYW1lcmEsIGN1cnJlbnRVc2VyKSB7XG4gICRzY29wZS5jdXJyZW50VXNlciA9IGN1cnJlbnRVc2VyO1xuICAkc2NvcGUuZ2V0UGhvdG8gPSBmdW5jdGlvbiAoKSB7XG4gICAgQ2FtZXJhLmdldFBpY3R1cmUoKS50aGVuKGZ1bmN0aW9uIChpbWFnZVVSSSkge1xuICAgICAgY29uc29sZS5sb2coaW1hZ2VVUkkpO1xuICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICB9KTtcbiAgfTtcbn0pOyIsIid1c2Ugc3RyaWN0JztcblxuYW5ndWxhci5tb2R1bGUoJ1ZveW8nKS5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcbiAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2FwcC5kYXNoJywge1xuICAgIHVybDogJy9kYXNoJyxcbiAgICB2aWV3czoge1xuICAgICAgJ2FwcC1kYXNoJzoge1xuICAgICAgICB0ZW1wbGF0ZVVybDogJ2Rhc2hib2FyZC90ZW1wbGF0ZS5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogJ0Rhc2hib2FyZENvbnRyb2xsZXInXG4gICAgICB9XG4gICAgfSxcbiAgICByZXNvbHZlOiB7XG4gICAgICBjdXJyZW50VXNlcjogWyckc3RhdGUnLCAnQXV0aCcsICdVc2VyJywgJ2N1cnJlbnRBdXRoJywgZnVuY3Rpb24gKCRzdGF0ZSwgQXV0aCwgVXNlciwgY3VycmVudEF1dGgpIHtcbiAgICAgICAgcmV0dXJuIFVzZXIoY3VycmVudEF1dGgudWlkKS4kbG9hZGVkKCk7XG4gICAgICB9XVxuICAgIH1cbiAgfSk7XG59KTsiLCIndXNlIHN0cmljdCc7XG5cbmFuZ3VsYXIubW9kdWxlKCdWb3lvLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignTG9naW5Db250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgQXV0aCwgJGlvbmljUG9wdXAsICRzdGF0ZSwgY3VycmVudEF1dGgpIHtcblxuICBjb25zb2xlLmxvZyhjdXJyZW50QXV0aCk7XG4gICRzY29wZS51c2VyID0ge1xuICAgIGVtYWlsOiAnJyxcbiAgICBwYXNzd29yZDogJydcbiAgfTtcblxuICAkc2NvcGUuc2lnbkluID0gZnVuY3Rpb24gKCkge1xuICAgIEF1dGgubG9naW4oJHNjb3BlLnVzZXIpLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgJHNjb3BlLnVzZXIgPSB7XG4gICAgICAgIGVtYWlsOiAnJyxcbiAgICAgICAgcGFzc3dvcmQ6ICcnXG4gICAgICB9O1xuICAgICAgJHN0YXRlLmdvKCdhcHAuZGFzaCcpO1xuICAgIH0pWydjYXRjaCddKGVyck1lc3NhZ2UpO1xuICB9O1xuXG4gICRzY29wZS5zb2NpYWxMb2dpbiA9IGZ1bmN0aW9uIChwcm92aWRlcikge1xuICAgIEF1dGguc29jaWFsTG9naW4ocHJvdmlkZXIpO1xuICB9O1xuXG4gICRzY29wZS5jcmVhdGVVc2VyID0gZnVuY3Rpb24gKCkge1xuICAgIEF1dGgucmVnaXN0ZXIoJHNjb3BlLnVzZXIpWydjYXRjaCddKGVyck1lc3NhZ2UpO1xuICB9O1xuXG4gIHZhciBhbGVydFNob3cgPSBmdW5jdGlvbiBhbGVydFNob3codGl0LCBtc2cpIHtcbiAgICAkaW9uaWNQb3B1cC5hbGVydCh7XG4gICAgICB0aXRsZTogdGl0LFxuICAgICAgdGVtcGxhdGU6IG1zZ1xuICAgIH0pLnRoZW4oZnVuY3Rpb24gKHJlcykge30pO1xuICB9O1xuXG4gIHZhciBlcnJNZXNzYWdlID0gZnVuY3Rpb24gZXJyTWVzc2FnZShlcnIpIHt9O1xuICAvLyBpZiBlcnIgYW5kIGVyci5jb2RlXG4gIC8vICAgbXNnID0gc3dpdGNoIGVyci5jb2RlXG4gIC8vICAgICB3aGVuICdFTUFJTF9UQUtFTicgdGhlbiAnVGhpcyBFbWFpbCBoYXMgYmVlbiB0YWtlbi4nXG4gIC8vICAgICB3aGVuICdJTlZBTElEX0VNQUlMJyB0aGVuICdJbnZhbGlkIEVtYWlsLidcbiAgLy8gICAgIHdoZW4gJ05FVFdPUktfRVJST1InIHRoZW4gJ05ldHdvcmsgRXJyb3IuJ1xuICAvLyAgICAgd2hlbiAnSU5WQUxJRF9QQVNTV09SRCcgdGhlbiAnSW52YWxpZCBQYXNzd29yZC4nXG4gIC8vICAgICB3aGVuICdJTlZBTElEX1VTRVInIHRoZW4gJ0ludmFsaWQgVXNlci4nXG4gIC8vICAgICBlbHNlICdVbmtub3duIEVycm9yLi4uJ1xuICAvLyBhbGVydFNob3cgJ0Vycm9yJywgbXNnXG59KTsiLCIndXNlIHN0cmljdCc7XG5cbmFuZ3VsYXIubW9kdWxlKCdWb3lvJykuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdsb2dpbicsIHtcbiAgICB1cmw6ICcvbG9naW4nLFxuICAgIGNvbnRyb2xsZXI6ICdMb2dpbkNvbnRyb2xsZXInLFxuICAgIHRlbXBsYXRlVXJsOiAnbG9naW4vdGVtcGxhdGUuaHRtbCcsXG4gICAgcmVzb2x2ZToge1xuICAgICAgY3VycmVudEF1dGg6IFsnJHN0YXRlJywgJ0F1dGgnLCBmdW5jdGlvbiAoJHN0YXRlLCBBdXRoKSB7XG4gICAgICAgIC8vICR3YWl0Rm9yQXV0aCByZXR1cm5zIGEgcHJvbWlzZSBzbyB0aGUgcmVzb2x2ZSB3YWl0cyBmb3IgaXQgdG8gY29tcGxldGVcbiAgICAgICAgcmV0dXJuIEF1dGguYXV0aC4kd2FpdEZvckF1dGgoKS50aGVuKGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgICBpZiAob2JqICE9IG51bGwpIHtcbiAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmRhc2gnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfV1cbiAgICB9XG4gIH0pO1xufSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmFuZ3VsYXIubW9kdWxlKCdWb3lvJykuZmFjdG9yeShcIlVzZXJcIiwgW1wiJGZpcmViYXNlT2JqZWN0XCIsICdGSVJFQkFTRV9VUkwnLCBmdW5jdGlvbiAoJGZpcmViYXNlT2JqZWN0LCBGSVJFQkFTRV9VUkwpIHtcbiAgLy8gY3JlYXRlIGEgbmV3IHNlcnZpY2UgYmFzZWQgb24gJGZpcmViYXNlT2JqZWN0XG4gIHZhciBVc2VyID0gJGZpcmViYXNlT2JqZWN0LiRleHRlbmQoe1xuICAgIC8vIHRoZXNlIG1ldGhvZHMgZXhpc3Qgb24gdGhlIHByb3RvdHlwZSwgc28gd2UgY2FuIGFjY2VzcyB0aGUgZGF0YSB1c2luZyBgdGhpc2BcbiAgICBnZXRGdWxsTmFtZTogZnVuY3Rpb24gZ2V0RnVsbE5hbWUoKSB7XG4gICAgICByZXR1cm4gdGhpcy5maXJzdE5hbWUgKyBcIiBcIiArIHRoaXMubGFzdE5hbWU7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGZ1bmN0aW9uICh1c2VySWQpIHtcbiAgICB2YXIgcmVmID0gbmV3IEZpcmViYXNlKEZJUkVCQVNFX1VSTCArIFwidXNlcnMvXCIpLmNoaWxkKHVzZXJJZCk7XG4gICAgLy8gY3JlYXRlIGFuIGluc3RhbmNlIG9mIFVzZXIgKHRoZSBuZXcgb3BlcmF0b3IgaXMgcmVxdWlyZWQpXG4gICAgcmV0dXJuIG5ldyBVc2VyKHJlZik7XG4gIH07XG59XSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG5hbmd1bGFyLm1vZHVsZSgnVm95by5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1Byb2ZpbGVDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgQXV0aCwgQ2FtZXJhLCBjdXJyZW50QXV0aCkge1xuICBjb25zb2xlLmxvZyhjdXJyZW50QXV0aCk7XG4gICRzY29wZS5sb2dvdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgQXV0aC5sb2dvdXQoKTtcbiAgfTtcbn0pOyIsIid1c2Ugc3RyaWN0JztcblxuYW5ndWxhci5tb2R1bGUoJ1ZveW8nKS5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcbiAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2FwcC5wcm9maWxlJywge1xuICAgIHVybDogJy9wcm9maWxlJyxcbiAgICB2aWV3czoge1xuICAgICAgJ2FwcC1wcm9maWxlJzoge1xuICAgICAgICB0ZW1wbGF0ZVVybDogJ3Byb2ZpbGUvdGVtcGxhdGUuaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdQcm9maWxlQ29udHJvbGxlcidcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG5hbmd1bGFyLm1vZHVsZSgnVm95bycpLmZhY3RvcnkoJ0F1dGgnLCBmdW5jdGlvbiAoRklSRUJBU0VfVVJMLCAkZmlyZWJhc2VBdXRoLCAkZmlyZWJhc2VBcnJheSwgJGZpcmViYXNlT2JqZWN0LCAkc3RhdGUsIFVzZXJTZXJ2aWNlKSB7XG4gIHZhciByZWYgPSBuZXcgRmlyZWJhc2UoRklSRUJBU0VfVVJMKTtcblxuICByZXR1cm4ge1xuICAgIGF1dGg6ICRmaXJlYmFzZUF1dGgocmVmKSxcbiAgICB1c2VyOiBudWxsLFxuXG4gICAgY3JlYXRlU29jaWFsUHJvZmlsZTogZnVuY3Rpb24gY3JlYXRlU29jaWFsUHJvZmlsZSh1aWQsIHVzZXIpIHtcbiAgICAgIHZhciB1c2Vyc1JlZiA9IG5ldyBGaXJlYmFzZSgnaHR0cHM6Ly92b3lvLmZpcmViYXNlaW8uY29tL3VzZXJzLycgKyB1aWQpLFxuICAgICAgICAgIGZiUmVmID0gbmV3IEZpcmViYXNlKCdodHRwczovL3ZveW8uZmlyZWJhc2Vpby5jb20vZmFjZWJvb2tVc2Vycy8nICsgdWlkKSxcbiAgICAgICAgICBwcm9maWxlID0ge1xuICAgICAgICBpZDogdWlkLFxuICAgICAgICBmYWNlYm9va1VzZXJJZDogdXNlci5mYWNlYm9vay5pZCxcbiAgICAgICAgZW1haWw6IHVzZXIuZmFjZWJvb2suZW1haWwsXG4gICAgICAgIGZpcnN0TmFtZTogdXNlci5mYWNlYm9vay5jYWNoZWRVc2VyUHJvZmlsZS5maXJzdF9uYW1lLFxuICAgICAgICBsYXN0TmFtZTogdXNlci5mYWNlYm9vay5jYWNoZWRVc2VyUHJvZmlsZS5sYXN0X25hbWUsXG4gICAgICAgIHJlZ2lzdGVyZWRBdDogbmV3IERhdGUoKSxcbiAgICAgICAgcHJvZmlsZUltYWdlVXJsOiB1c2VyLmZhY2Vib29rLnByb2ZpbGVJbWFnZVVSTFxuICAgICAgfSxcbiAgICAgICAgICBmYWNlYm9va1Byb2ZpbGUgPSB1c2VyLmZhY2Vib29rO1xuXG4gICAgICByZXR1cm4gdXNlcnNSZWYuc2V0KHByb2ZpbGUsIGZ1bmN0aW9uIChyZWYpIHtcbiAgICAgICAgZmJSZWYuc2V0KGZhY2Vib29rUHJvZmlsZSk7XG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgbG9naW46IGZ1bmN0aW9uIGxvZ2luKHVzZXIpIHtcbiAgICAgIHJldHVybiB0aGlzLmF1dGguJGF1dGhXaXRoUGFzc3dvcmQoe1xuICAgICAgICBlbWFpbDogdXNlci5lbWFpbCxcbiAgICAgICAgcGFzc3dvcmQ6IHVzZXIucGFzc3dvcmRcbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBzb2NpYWxMb2dpbjogZnVuY3Rpb24gc29jaWFsTG9naW4ocHJvdmlkZXIpIHtcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgIHJldHVybiB0aGlzLmF1dGguJGF1dGhXaXRoT0F1dGhQb3B1cChwcm92aWRlciwge1xuICAgICAgICBzY29wZTogJ3VzZXJfYmlydGhkYXksIHVzZXJfbG9jYXRpb24sIHVzZXJfYWJvdXRfbWUsIGVtYWlsLCBwdWJsaWNfcHJvZmlsZSdcbiAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKGF1dGhEYXRhKSB7XG4gICAgICAgIHZhciBmYlF1ZXJ5UmVmID0gbmV3IEZpcmViYXNlKFwiaHR0cHM6Ly92b3lvLmZpcmViYXNlaW8uY29tL2ZhY2Vib29rVXNlcnNcIik7XG4gICAgICAgIHJldHVybiBmYlF1ZXJ5UmVmLm9yZGVyQnlDaGlsZChcImlkXCIpLmVxdWFsVG8oYXV0aERhdGEuZmFjZWJvb2suaWQpLm9uY2UoJ3ZhbHVlJywgZnVuY3Rpb24gKHNuYXBzaG90KSB7XG4gICAgICAgICAgaWYgKHNuYXBzaG90Lm51bUNoaWxkcmVuKCkgPT09IDApIHtcbiAgICAgICAgICAgIF90aGlzLmNyZWF0ZVNvY2lhbFByb2ZpbGUoYXV0aERhdGEudWlkLCBhdXRoRGF0YSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmRhc2gnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSxcblxuICAgIHJlZ2lzdGVyOiBmdW5jdGlvbiByZWdpc3Rlcih1c2VyKSB7XG4gICAgICB2YXIgX3RoaXMyID0gdGhpcztcblxuICAgICAgcmV0dXJuIHRoaXMuYXV0aC4kY3JlYXRlVXNlcih7XG4gICAgICAgIGVtYWlsOiB1c2VyLmVtYWlsLFxuICAgICAgICBwYXNzd29yZDogdXNlci5wYXNzd29yZFxuICAgICAgfSkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vICBhdXRoZW50aWNhdGUgc28gd2UgaGF2ZSBwZXJtaXNzaW9uIHRvIHdyaXRlIHRvIEZpcmViYXNlXG4gICAgICAgIHJldHVybiBfdGhpczIubG9naW4odXNlcik7XG4gICAgICB9KS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIC8vICBzdG9yZSB1c2VyIGRhdGEgaW4gRmlyZWJhc2UgYWZ0ZXIgY3JlYXRpbmcgYWNjb3VudFxuICAgICAgICAvLyBjb25zb2xlLmxvZygnZGF0b3MgZGVsIHVzdWFyaW86JyArIEpTT04uc3RyaW5naWZ5KGRhdGEpKVxuICAgICAgICByZXR1cm4gVXNlclNlcnZpY2UuY3JlYXRlUHJvZmlsZShkYXRhLnVpZCwgdXNlcik7XG4gICAgICB9KVsnY2F0Y2gnXShmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgfSk7XG4gICAgfSxcblxuICAgIGxvZ291dDogZnVuY3Rpb24gbG9nb3V0KCkge1xuICAgICAgcmV0dXJuIHRoaXMuYXV0aC4kdW5hdXRoKCk7XG4gICAgfSxcblxuICAgIHJlc2V0cGFzc3dvcmQ6IGZ1bmN0aW9uIHJlc2V0cGFzc3dvcmQodXNlcikge1xuICAgICAgcmV0dXJuIHRoaXMuYXV0aC4kcmVzZXRQYXNzd29yZCh7XG4gICAgICAgIGVtYWlsOiB1c2VyLmVtYWlsXG4gICAgICB9KS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ1Bhc3N3b3JkIHJlc2V0IGVtYWlsIHNlbnQgc3VjY2Vzc2Z1bGx5IScpO1xuICAgICAgfSlbJ2NhdGNoJ10oZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yOiAnLCBlcnJvci5tZXNzYWdlKTtcbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBjaGFuZ2VQYXNzd29yZDogZnVuY3Rpb24gY2hhbmdlUGFzc3dvcmQodXNlcikge1xuICAgICAgcmV0dXJuIHRoaXMuYXV0aC4kY2hhbmdlUGFzc3dvcmQoe1xuICAgICAgICBlbWFpbDogdXNlci5lbWFpbCxcbiAgICAgICAgb2xkUGFzc3dvcmQ6IHVzZXIub2xkUGFzcyxcbiAgICAgICAgbmV3UGFzc3dvcmQ6IHVzZXIubmV3UGFzc1xuICAgICAgfSk7XG4gICAgfSxcblxuICAgIHNpZ25lZEluOiBmdW5jdGlvbiBzaWduZWRJbigpIHtcbiAgICAgIHJldHVybiAhIXRoaXMudXNlcjtcbiAgICB9XG4gIH07XG59KTsiLCIndXNlIHN0cmljdCc7XG5cbmFuZ3VsYXIubW9kdWxlKCdWb3lvLnNlcnZpY2VzJykuZmFjdG9yeSgnQ2FtZXJhJywgWyckcScsIGZ1bmN0aW9uICgkcSkge1xuICByZXR1cm4ge1xuICAgIGdldFBpY3R1cmU6IGZ1bmN0aW9uIGdldFBpY3R1cmUob3B0aW9ucykge1xuICAgICAgdmFyIHEgPSAkcS5kZWZlcigpO1xuXG4gICAgICBuYXZpZ2F0b3IuY2FtZXJhLmdldFBpY3R1cmUoZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICBxLnJlc29sdmUocmVzdWx0KTtcbiAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgcS5yZWplY3QoZXJyKTtcbiAgICAgIH0sIG9wdGlvbnMpO1xuXG4gICAgICByZXR1cm4gcS5wcm9taXNlO1xuICAgIH1cbiAgfTtcbn1dKTsiLCIndXNlIHN0cmljdCc7XG5cbmFuZ3VsYXIubW9kdWxlKCdWb3lvLnNlcnZpY2VzJykuc2VydmljZSgnVXNlclNlcnZpY2UnLCBmdW5jdGlvbiAoVXNlcikge1xuICB0aGlzLmNyZWF0ZVByb2ZpbGUgPSBmdW5jdGlvbiAodWlkLCB1c2VyKSB7XG4gICAgdmFyIHByb2ZpbGUgPSB7XG4gICAgICBpZDogdWlkLFxuICAgICAgZW1haWw6IHVzZXIuZW1haWwsXG4gICAgICByZWdpc3RlcmVkQXQ6IG5ldyBEYXRlKClcbiAgICB9O1xuXG4gICAgdmFyIHVzZXJzUmVmID0gVXNlcih1aWQpO1xuICAgIHJldHVybiB1c2Vyc1JlZi5zZXQocHJvZmlsZSk7XG4gIH07XG59KTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
