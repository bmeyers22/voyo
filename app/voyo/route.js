angular.module('Voyo')
  .config( function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app.voyo', {
      url: '/voyo',
      templateUrl: 'voyo/template.html',
      controller: 'VoyoController'
    });
  });
