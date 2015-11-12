angular.module('Voyo')
  .config( function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app.voyo.chapter', {
      url: '/chapter/:chapterId',
      views: {
        'app-voyo-container': {
          templateUrl: 'chapter/template.html',
          controller: 'ChapterController',
        }
      },
      resolve: {
        voyo: ['$stateParams', 'voyo', function ($stateParams, voyo) {
          return voyo;
        }],
        chapter: [ '$stateParams', 'Chapter', function ($stateParams, Chapter) {
          return Chapter.find($stateParams.chapterId);
        }]
      }

    });
  });
