angular.module('Voyo.controllers').controller('CardEditIndexController', function ($scope, $state, card) {
  $scope.close = function () {
    card.$remove().then(function () {
      $state.go('app.tabs.dash');
    })
  }
});
