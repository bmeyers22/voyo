angular.module('Voyo').factory("Chapter", ["$firebaseObject", 'FIREBASE_URL', 'BaseModel', 'Timestampable',
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
    let Chapter = BaseModel('voyo-chapters', defaultProperties(), Timestampable);
    Chapter.create = function(properties) {
      var arr = new Firebase(`${FIREBASE_URL}voyo-chapters/`),
        ref = arr.push(angular.extend(defaultProperties(), properties));

      return new Chapter(ref.key()).$loaded().then( (voyo) => {
        return voyo;
      })
    }
    Chapter.get = function(options) {
      return new Promise((resolve, reject) => {
        var ref = new Firebase(`${FIREBASE_URL}voyo-chapters/`);
        ref.orderByChild("createdAt").startAt().once("value", function(snapshot) {
          let chapters;
          if (snapshot.numChildren() > 0) {
            chapters = Object.keys(snapshot.val()).map(function(key) {
              return new Chapter(key);
            })
          } else {
            chapters = [];
          }
          resolve(chapters);
        });
      });
    }

    return Chapter;
  }
]);
