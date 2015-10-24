angular.module('Voyo').factory("Story", ["$firebaseObject", 'FIREBASE_URL', 'BaseModel', 'Timestampable',
  function($firebaseObject, FIREBASE_URL, BaseModel, Timestampable) {
    // create a new service based on $firebaseObject
    let defaultProperties = {
      title: '',
      caption: '',
      media: ''
    };
    let Story = BaseModel('stories', defaultProperties, Timestampable);
    Story.create = function(properties) {
      var arr = new Firebase(`${FIREBASE_URL}stories/`),
        ref = arr.push(defaultProperties);

      return new Story(ref.key());
    }
    Story.get = function() {
      return new Promise((resolve, reject) => {
        var ref = new Firebase(`${FIREBASE_URL}stories/`);
        ref.orderByChild("createdAt").once("value", function(snapshot) {
          resolve(
            Object.keys(snapshot.val()).map(function(key) {
              return new Story(key);
            })
          );
        });

      })
    }

    return Story;
  }
]);
