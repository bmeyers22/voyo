angular.module('Voyo')
  .config( function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app.story', {
      url: '/story',
      abstract: true,
      views: {
        "overlay": {
          templateUrl: 'story/template.html',
          controller: 'StoryController'
        }
      }
    });
  });
