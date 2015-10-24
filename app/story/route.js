angular.module('Voyo')
  .config( function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app.story', {
      url: '/story',
      abstract: true,
      views: {
        'app-story': {
          templateUrl: 'story/template.html',
          controller: 'StoryController'
        }
      },
      templateUrl: 'story/template.html'
    });
  });
