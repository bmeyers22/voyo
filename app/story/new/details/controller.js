angular.module('Voyo.controllers').controller('StoryNewDetailsController', function ($scope, $state, LocationService, Story, story) {
  $scope.story = story;

  LocationService.getNearestPlace().then((place) => {
    $scope.story.location = place;
  })


  $scope.complete = function () {
    return Story.create($scope.story).then(() => {
      $state.go('app.tabs.dash');
    });
  }
});
