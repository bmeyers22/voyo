angular.module('Voyo')
  .config( function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app.story.new', {
      cache: false,
      url: '/new',
      abstract: true,
      views: {
        'app-story-container': {
          templateUrl: 'story/new/template.html',
          controller: 'StoryNewController'
        }
      },
      resolve: {
        story: ['$state', 'Story', function ($state, Story) {
          return Story.create();
        }]
      }
    });
  });
