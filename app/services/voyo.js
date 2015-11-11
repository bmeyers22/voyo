angular.module('Voyo.services').service( 'VoyoModelService', function (Voyo, Card, lodash) {

  return {
    createVoyo(user) {
      let voyo;
      return Voyo.create({
        user: user.$id
      }).then( (data) => {
        voyo = data;
        let proms = lodash.range(Voyo.DEFAULT_CARD_COUNT).map(function (i) {
          return Card.create({
            voyo: voyo.$id,
            gridPosition: i
          })
        });
        return Promise.all(proms).then((cards) => {
          cards.forEach((card) => {
            voyo.cards[card.$id] = true
          });
        }).then(function () {
          return voyo.save();
        }).then(function () {
          return voyo;
        });
      });
    }
  };
});
