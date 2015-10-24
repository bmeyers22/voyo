angular.module('Voyo.controllers').controller('StoryNewController', function ($scope, $state, story) {

  $scope.story = story;
  $scope.mediaUrl = '';

  $scope.$on('PickedMediaFile', function (ev, url) {
    $scope.mediaUrl = url;
    $state.go('app.story.new.filters');
  });

});
