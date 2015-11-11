angular.module('Voyo')
  .config( function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app.voyo.card.edit', {
      url: '/edit',
      views: {
        'app-voyo-edit-container': {
          templateUrl: 'card/edit/template.html',
          controller: 'CardEditController'
        }
      },
      resolve: {
        card: ['card', function (card) {
          return card;
        }]
      }
    });
  });
