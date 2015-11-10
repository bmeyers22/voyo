angular.module('Voyo.controllers').controller('CardNewController', function ($scope, $state, card) {

  $scope.card = card;
  $scope.mediaUrl = '';

  $scope.$on('PickedMediaFile', function (ev, url, type) {
    $scope.mediaUrl = url;
    $scope.mediaType = type;
    $state.go('app.voyo.card.new.filters');
  });

});
