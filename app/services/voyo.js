angular.module('Voyo.services').service( 'VoyoModelService', function (Voyo, Chapter, lodash) {

  return {
    createVoyo(user) {
      let voyo;
      return Voyo.create({
        user: user.$id
      }).then( (data) => {
        voyo = data;
        let proms = lodash.range(Voyo.DEFAULT_CARD_COUNT).map(function (i) {
          return Chapter.create({
            voyo: voyo.$id,
            gridPosition: i
          })
        });
        return Promise.all(proms)
      }).then((chapters) => {
        voyo.chapters = {}
        chapters.forEach((chapter) => {
          voyo.chapters[chapter.$id] = true
        });
        return voyo;
      }).then(function () {
        return voyo.save();
      }).then(function (model) {
        return model;
      });
    }
  };
});
