angular.module('Voyo')
  .config( function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app.voyo.card.new.index', {
      url: '',
      views: {
        'app-card-new-container': {
          controller: 'CardNewIndexController',
          templateUrl: 'card/new/index/template.html',
        }
      }
    });
  });
