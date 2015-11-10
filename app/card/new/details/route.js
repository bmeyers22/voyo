angular.module('Voyo')
  .config( function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app.voyo.card.new.details', {
      url: '/details',
      views: {
        'app-card-new-container': {
          controller: 'CardNewDetailsController',
          templateUrl: 'card/new/details/template.html',
        }
      },
      resolve: {
        card: ['card', function (card) {
          return card;
        }]
      }
    });
  });
