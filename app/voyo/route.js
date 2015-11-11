angular.module('Voyo')
  .config( function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app.voyo', {
      url: '/voyo/:voyoId',
      templateUrl: 'voyo/template.html',
      controller: 'VoyoController',
      resolve: {
        voyo: ['$stateParams', 'Voyo', function ($stateParams, Voyo) {
          return Voyo.find($stateParams.voyoId);
        }],
        cards: [ 'Card', 'voyo', function (Card, voyo) {
          return Promise.all(Object.keys(voyo.cards).map((id) => {
            return Card.find(id)
          }))
        }]
      }
    });
  });
