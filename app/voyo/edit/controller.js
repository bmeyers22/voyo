angular.module('Voyo.controllers').controller('VoyoEditController', function ($scope, $state, voyo) {
  $scope.voyo = voyo;
  $scope.$on('Card:edit', (ev, card) => {
    $state.go('app.voyo.edit.card.edit', { cardId: card.$id });
  })

});
