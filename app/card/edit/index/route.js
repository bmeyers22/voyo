angular.module('Voyo')
  .config( function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app.voyo.card.edit.index', {
      url: '',
      views: {
        'app-card-new-container': {
          controller: 'CardEditIndexController',
          templateUrl: 'card/edit/index/template.html',
        }
      }
    });
  });
