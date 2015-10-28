angular.module('Voyo')
  .config( function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app.story.new.filters', {
      cache: false,
      url: '/filters',
      views: {
        'app-story-new-container': {
          controller: 'StoryNewFiltersController',
          templateUrl: 'story/new/filters/template.html',
        }
      },
      resolve: {
        story: ['story', function (story) {
          return story;
        }]
      }
    });
  });
