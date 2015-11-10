angular.module('Voyo.controllers').controller('VoyoNewIndexController', function ($scope, $state, voyo) {
  $scope.delete = function () {
    voyo.$remove().then(function () {
      $state.go('app.tabs.dash');
    })
  }
});
