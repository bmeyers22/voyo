angular.module('Voyo.controllers').controller('TabsController', function ($scope, $state, VoyoModelService, currentUser) {
  $scope.createVoyo = function () {
    return VoyoModelService.createVoyo(currentUser)
      .then(function (voyo) {
        $state.go('app.voyo.edit.index', { voyoId: voyo.$id })
      })
  }
});
