angular.module('Voyo')
  .config( function ($stateProvider, $urlRouterProvider) {
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
