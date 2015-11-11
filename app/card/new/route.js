angular.module('Voyo')
  .config( function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app.voyo.card.new', {
      cache: false,
      url: '/new/:card_id',
      abstract: true,
      views: {
        'app-card-container': {
          templateUrl: 'card/new/template.html',
          controller: 'CardNewController'
        }
      },
      resolve: {
        card: ['$state', 'Card', function ($state, Card) {
          return Card.create();
        }]
      }
    });
  });
