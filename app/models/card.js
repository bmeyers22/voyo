angular.module('Voyo').factory("Card", ["$firebaseObject", 'FIREBASE_URL', 'BaseModel', 'Timestampable',
  function($firebaseObject, FIREBASE_URL, BaseModel, Timestampable) {
    // create a new service based on $firebaseObject
    let defaultProperties = function () {
      return {
        title: '',
        caption: '',
        media: '',
        createdAt: new Date().getTime()
      }
    };
    let Card = BaseModel('voyo-cards', defaultProperties(), Timestampable);
    Card.create = function(properties) {
      var arr = new Firebase(`${FIREBASE_URL}voyo-cards/`),
        ref = arr.push(angular.extend(defaultProperties(), properties));

      return new Card(ref.key()).$loaded().then( (voyo) => {
        return voyo;
      })
    }
    Card.get = function(options) {
      return new Promise((resolve, reject) => {
        var ref = new Firebase(`${FIREBASE_URL}voyo-cards/`);
        ref.orderByChild("createdAt").startAt().once("value", function(snapshot) {
          let cards;
          if (snapshot.numChildren() > 0) {
            cards = Object.keys(snapshot.val()).map(function(key) {
              return new Card(key);
            })
          } else {
            cards = [];
          }
          resolve(cards);
        });
      });
    }

    return Card;
  }
]);
