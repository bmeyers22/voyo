angular.module('Voyo')
  .config( function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app.voyo.edit', {
      url: '/edit',
      abstract: true,
      templateUrl: 'voyo/edit/template.html',
      controller: 'VoyoEditController',
      resolve: {
        voyo: ['$stateParams', 'voyo', function ($stateParams, voyo) {
          return voyo;
        }],
        chapters: ['$stateParams', 'chapters', function ($stateParams, chapters) {
          return chapters;
        }]
      }
    });
  });
