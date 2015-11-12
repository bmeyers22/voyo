angular.module('Voyo')
  .config( function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app.voyo.edit.chapter', {
      url: '/chapter/:chapterId',
      abstract: true,
      templateUrl: 'chapter/edit/template.html',
      controller: 'ChapterEditController',
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
