angular.module('Voyo').run(['$rootScope', '$state', 'Auth', function ($rootScope, $state, Auth) {

  Auth.auth.$onAuth( function (authData) {
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
    console.log('$stateChangeStart to '+toState.to+'- fired when the transition begins. toState,toParams : \n',toState, toParams);
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
}]).config( function ($stateProvider, $urlRouterProvider) {
  // # Ionic uses AngularUI Router which uses the concept of states
  // # Learn more here: https:#github.com/angular-ui/ui-router
  // # Set up the various states which the app can be in.
  // # Each state's controller can be found in controllers.js
  $stateProvider.state('index', {
    url: '',
    resolve: {
      currentAuth: ['Auth', function (Auth) {
        // # $waitForAuth returns a promise so the resolve waits for it to complete
        Auth.auth.$waitForAuth().then(function () {

        });
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
        return Auth.auth.$requireAuth()
      }]
    }
  });
});
