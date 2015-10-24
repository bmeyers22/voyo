angular.module('Voyo')
  .config( function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app.story.new.index', {
      url: '',
      views: {
        'app-story-new-container': {
          controller: 'StoryNewIndexController',
          templateUrl: 'story/new/index/template.html',
        }
      }
    });
  });
