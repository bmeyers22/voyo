angular.module('Voyo.controllers').controller('StoryNewIndexController', function ($scope, $state, story) {
  $scope.close = function () {
    story.$remove().then(function () {
      $state.go('app.tabs.dash');
    })
  }
});
