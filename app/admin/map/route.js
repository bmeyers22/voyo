angular.module('Voyo')
  .config( function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app.admin.map', {
      url: '/map',
      controller: 'AdminMapController',
      templateUrl: 'admin/map/template.html',
      resolve: {
      }
    });
  });
