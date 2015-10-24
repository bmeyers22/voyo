angular.module('Voyo.controllers').controller('StoryNewDetailsController', function ($scope, $state, story) {
  $scope.story = story;

  $scope.complete = function () {
    $scope.story.save().then(() => {
      $state.go('app.dash')
    })
  }
});
