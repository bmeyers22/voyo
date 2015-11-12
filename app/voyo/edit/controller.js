angular.module('Voyo.controllers').controller('VoyoEditController', function ($scope, $state, voyo) {
  $scope.voyo = voyo;
  $scope.$on('Chapter:edit', (ev, chapter) => {
    $state.go('app.voyo.edit.chapter.index', { chapterId: chapter.$id });
  })

});
