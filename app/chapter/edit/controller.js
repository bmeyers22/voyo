angular.module('Voyo.controllers').controller('ChapterEditController', function ($scope, $state, chapter) {

  $scope.chapter = chapter;
  $scope.mediaUrl = '';

  $scope.$on('PickedMediaFile', function (ev, url, type) {
    $scope.mediaUrl = url;
    $scope.mediaType = type;
    $state.go('app.voyo.edit.chapter.filters');
  });

});
