angular.module('Voyo')
  .config( function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app.voyo.edit.chapter.index', {
      url: '',
      views: {
        'app-chapter-new-container': {
          controller: 'ChapterEditIndexController',
          templateUrl: 'chapter/edit/index/template.html',
        }
      }
    });
  });
