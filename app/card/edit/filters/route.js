angular.module('Voyo')
  .config( function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app.voyo.card.edit.filters', {
      url: '/filters',
      views: {
        'app-card-new-container': {
          controller: 'CardEditFiltersController',
          templateUrl: 'card/edit/filters/template.html',
        }
      },
      resolve: {
        card: ['card', function (card) {
          return card;
        }]
      }
    });
  });
