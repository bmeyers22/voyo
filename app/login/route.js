angular.module('Voyo')
  .config( function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('login', {
      url: '/login',
      controller: 'LoginController',
      templateUrl: 'login/template.html',
      resolve: {
        currentAuth: ['$state', 'Auth', function ($state, Auth) {
          // $waitForAuth returns a promise so the resolve waits for it to complete
          return Auth.auth.$waitForAuth().then( (obj) => {
            if (obj != null) {
              $state.go('app.dash');
            }
          })
        }]
      }
    });
  });
