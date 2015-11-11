angular.module('Voyo')
  .config( function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app.edit.card.edit.details', {
      url: '/details',
      views: {
        'app-card-new-container': {
          controller: 'CardEditDetailsController',
          templateUrl: 'card/edit/details/template.html',
        }
      },
      resolve: {
        card: ['card', function (card) {
          return card;
        }]
      }
    });
  });
