angular.module('Voyo')
  .config( function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app.tabs', {
      url: '/tabs',
      abstract: true,
      templateUrl: 'tabs/template.html',
      resolve: {
      }
    });
  });
