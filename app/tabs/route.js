angular.module('Voyo')
  .config( function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app.tabs', {
      url: '/tabs',
      abstract: true,
      views: {
        'main': {
          templateUrl: 'tabs/template.html',
        },
        'overlay': {
          template: '<ion-view class="empty" cache-view="false"></ion-view>'
        }
      },
      resolve: {
      }
    });
  });
