angular.module('Voyo')
  .config( function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app.voyo.edit.index', {
      url: '',
      views: {
        'app-voyo-edit-container': {
          controller: 'VoyoEditIndexController',
          templateUrl: 'voyo/edit/index/template.html',
        }
      },
      resolve: {
        cards: ['$state', 'cards', function ($state, cards) {
          return cards;
        }]
      }

    });
  });
