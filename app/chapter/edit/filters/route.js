angular.module('Voyo')
  .config( function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app.voyo.edit.chapter.filters', {
      url: '/filters',
      views: {
        'app-chapter-new-container': {
          controller: 'ChapterEditFiltersController',
          templateUrl: 'chapter/edit/filters/template.html',
        }
      },
      resolve: {
        chapter: ['chapter', function (chapter) {
          return chapter;
        }]
      }
    });
  });
