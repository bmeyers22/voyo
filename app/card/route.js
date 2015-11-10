angular.module('Voyo')
  .config( function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app.voyo.card', {
      url: '/card',
      abstract: true,
      templateUrl: 'card/template.html',
      controller: 'CardController'
    });
  });
