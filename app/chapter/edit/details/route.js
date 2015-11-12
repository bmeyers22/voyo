angular.module('Voyo')
  .config( function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app.voyo.edit.chapter.details', {
      url: '/details',
      views: {
        'app-chapter-new-container': {
          controller: 'ChapterEditDetailsController',
          templateUrl: 'chapter/edit/details/template.html',
        }
      },
      resolve: {
        chapter: ['chapter', function (chapter) {
          return chapter;
        }]
      }
    });
  });
