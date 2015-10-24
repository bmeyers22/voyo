angular.module('Voyo')
  .config( function ($stateProvider, $urlRouterProvider) {
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
          return User.find(currentAuth.uid).$loaded();
        }]
      }
    });
  });
