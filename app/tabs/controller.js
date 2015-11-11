angular.module('Voyo.controllers').controller('TabsController', function ($scope, $state, Card, Voyo, currentUser) {
  $scope.createVoyo = function () {
    let voyo;
    Voyo.create({
      user: currentUser.$id
    }).then( (data) => {
      voyo = data;
      let proms = [0 ,1, 2, 3].map(function (i) {
        return Card.create({
          voyo: voyo.$id,
          gridPosition: i
        })
      });
      return Promise.all(proms).then((cards) => {
        cards.forEach((card) => {
          voyo.cards[card.$id] = true
        });
      }).then(function (cards) {
        return voyo.save();
      }).then(function () {
        $state.go('app.voyo.edit.index', { voyoId: voyo.$id })
      });

    })
  }
});
