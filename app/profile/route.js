angular.module('Voyo')
  .config( function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app.tabs.profile', {
      url: '/profile',
      views: {
        'tabs-profile': {
          templateUrl: 'profile/template.html',
          controller: 'ProfileController'
        }
      }
    });
  });
