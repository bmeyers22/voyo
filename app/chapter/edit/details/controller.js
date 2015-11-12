angular.module('Voyo.controllers').controller('ChapterEditDetailsController', function ($scope, $state, LocationService, chapter) {
  $scope.chapter = chapter;

  if (!$scope.chapter.location) {
    LocationService.getNearestPlace().then((place) => {
      $scope.chapter.location = place;
    });
  }


  $scope.complete = function () {
    return chapter.save().then(() => {
      $state.go('^.^.index');
    });
  }
});
