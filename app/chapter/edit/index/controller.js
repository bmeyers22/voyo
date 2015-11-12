angular.module('Voyo.controllers').controller('ChapterEditIndexController', function ($scope, $state, chapter) {
  $scope.close = function () {
    chapter.$remove().then(function () {
      $state.go('^.^');
    })
  }
});
