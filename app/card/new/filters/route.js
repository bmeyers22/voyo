angular.module('Voyo')
  .config( function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app.voyo.card.new.filters', {
      url: '/filters',
      views: {
        'app-card-new-container': {
          controller: 'CardNewFiltersController',
          templateUrl: 'card/new/filters/template.html',
        }
      },
      resolve: {
        card: ['card', function (card) {
          return card;
        }]
      }
    });
  });
