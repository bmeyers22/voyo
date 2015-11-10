angular.module('Voyo')
  .config( function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app.voyo.new.index', {
      url: '',
      views: {
        'app-voyo-new-container': {
          controller: 'VoyoNewIndexController',
          templateUrl: 'voyo/new/index/template.html',
        }
      }
    });
  });
