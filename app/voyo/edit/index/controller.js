angular.module('Voyo.controllers').controller('VoyoEditIndexController', function ($scope, $state, LocationService, voyo, cards) {
  angular.extend($scope, {
    cards: cards,
    voyo: voyo,
    delete() {
      cards.forEach((card) => {
        card.$remove();
      })
      voyo.$remove().then(function () {
        $state.go('app.tabs.dash');
      })
    }
  })

  LocationService.getGeocodeLocation().then((location) => {
    $scope.voyo.location = location;
  })

});
