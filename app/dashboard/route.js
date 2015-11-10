angular.module('Voyo')
  .config( function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app.tabs.dash', {
      url: '/dash',
      views: {
        'tabs-dash': {
          templateUrl: 'dashboard/template.html',
          controller: 'DashboardController'
        }
      },
      resolve: {
        currentUser: ['currentUser', function (currentUser) {
          return currentUser;
        }],
        voyos: ['$state', 'Voyo', function ($state, Voyo) {
          return Voyo.get();
        }]
      }
    });
  });
