angular.module('Voyo')
  .config( function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app.admin', {
      url: '/admin',
      abstract: true,
      views: {
        'main': {
          templateUrl: 'admin/template.html'
        }
      }
    });
  });
