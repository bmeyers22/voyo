angular.module('Voyo')
  .config( function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('admin', {
      url: '/admin',
      abstract: true,
      templateUrl: 'admin/template.html'
    });
  });
