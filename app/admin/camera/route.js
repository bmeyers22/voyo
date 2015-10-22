angular.module('Voyo')
  .config( function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('admin.camera', {
      url: '/camera',
      controller: 'AdminCameraController',
      templateUrl: 'admin/camera/template.html',
      resolve: {
      }
    });
  });
