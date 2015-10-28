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
        currentUser: ['$state', 'Auth', 'User', 'currentAuth', function ($state, Auth, User, currentAuth) {
          return User.find(currentAuth.uid).$loaded();
        }],
        stories: ['$state', 'Story', function ($state, Story) {
          return Story.get();
        }]
      }
    });
  });
