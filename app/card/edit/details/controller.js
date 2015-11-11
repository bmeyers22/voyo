angular.module('Voyo.controllers').controller('CardEditDetailsController', function ($scope, $state, LocationService, card) {
  $scope.card = card;

  LocationService.getNearestPlace().then((place) => {
    $scope.card.location = place;
  })


  $scope.complete = function () {
    return card.save().then(() => {
      $state.go('app.tabs.dash');
    });
  }
});
