angular.module('Voyo')
  .config( function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app.admin', {
      url: '/admin',
      abstract: true,
      templateUrl: 'admin/template.html'
    });
  });
