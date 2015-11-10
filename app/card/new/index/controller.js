angular.module('Voyo.controllers').controller('CardNewIndexController', function ($scope, $state, card) {
  $scope.close = function () {
    card.$remove().then(function () {
      $state.go('app.tabs.dash');
    })
  }
});
