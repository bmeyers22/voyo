angular.module('Voyo')
  .config( function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app.tabs', {
      url: '/tabs',
      abstract: true,
      controller: 'TabsController',
      templateUrl: 'tabs/template.html',
      resolve: {
        currentUser: ['currentUser', function (currentUser) {
          return currentUser
        }]
      }
    });
  });
