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
        chapters: [ 'Voyo', 'voyo', function (Voyo, voyo) {
          return Voyo.chapters(voyo);
        }]
      }
    });
  });
