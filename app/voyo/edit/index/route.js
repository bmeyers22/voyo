angular.module('Voyo')
  .config( function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app.voyo.edit.index', {
      url: '',
      controller: 'VoyoEditIndexController',
      templateUrl: 'voyo/edit/index/template.html',
    });
  });
