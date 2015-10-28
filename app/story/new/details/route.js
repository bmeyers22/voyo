angular.module('Voyo')
  .config( function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app.story.new.details', {
      cache: false,
      url: '/details',
      views: {
        'app-story-new-container': {
          controller: 'StoryNewDetailsController',
          templateUrl: 'story/new/details/template.html',
        }
      },
      resolve: {
        story: ['story', function (story) {
          return story;
        }]
      }
    });
  });
