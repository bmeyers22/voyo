angular.module('Voyo').factory("Voyo", ["$firebaseObject", 'FIREBASE_URL', 'BaseModel', 'Timestampable', 'Chapter',
  function($firebaseObject, FIREBASE_URL, BaseModel, Timestampable, Chapter) {
    // create a new service based on $firebaseObject
    let defaultProperties = function () {
      return {
        title: '',
        caption: '',
        createdAt: new Date().getTime()
      }
    };
    let Voyo = BaseModel('voyos', defaultProperties(), Timestampable);

    Voyo.DEFAULT_CARD_COUNT = 4;

    Voyo.create = function(properties) {
      var arr = new Firebase(`${FIREBASE_URL}voyos/`),
        ref = arr.push(angular.extend(defaultProperties(), properties));

      return new Voyo(ref.key()).$loaded().then( (voyo) => {
        return voyo;
      })
    };
    Voyo.chapters = function (voyo) {
      return new Promise((resolve, reject) => {
        var ref = new Firebase(`${FIREBASE_URL}voyo-chapters/`);
        ref.orderByChild('voyo').equalTo(voyo.$id).once('value', (snapshot) => {
          resolve(
            Object.keys(snapshot.val()).map(function(key) {
              return new Chapter(key);
            })
          )
        })
      });
    };
    Voyo.get = function(options) {
      return new Promise((resolve, reject) => {
        var ref = new Firebase(`${FIREBASE_URL}voyos/`);
        ref.orderByChild("createdAt").startAt().once("value", function(snapshot) {
          let voyos;
          if (snapshot.numChildren() > 0) {
            voyos = Object.keys(snapshot.val()).map(function(key) {
              return new Voyo(key);
            })
          } else {
            voyos = [];
          }
          resolve(voyos);
        });
      });
    };


    return Voyo;
  }
]);
