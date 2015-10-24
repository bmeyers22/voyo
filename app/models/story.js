angular.module('Voyo').factory("Story", ["$firebaseObject", 'FIREBASE_URL', 'BaseModel', 'Timestampable',
  function($firebaseObject, FIREBASE_URL, BaseModel, Timestampable) {
    // create a new service based on $firebaseObject
    let Story = BaseModel('stories', {}, Timestampable);
    Story.create = function(properties) {
      var arr = new Firebase(`${FIREBASE_URL}stories`);
      key = arr.push(properties).key();

      var ref = new Firebase(`${FIREBASE_URL}stories/`).child(key);

      return new Story(ref);
    }
    return Story;
  }
]);
