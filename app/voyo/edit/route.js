angular.module('Voyo')
  .config( function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app.voyo.edit', {
      url: '/edit',
      views: {
        'app-voyo-container': {
          templateUrl: 'voyo/edit/template.html',
          controller: 'VoyoEditController'
        }
      },
      resolve: {
        voyo: ['$stateParams', 'voyo', function ($stateParams, voyo) {
          return voyo;
        }]
      }
    });
  });
