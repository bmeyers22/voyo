angular.module('Voyo').factory("Profile", ["$firebaseObject", 'FIREBASE_URL', 'BaseModel', 'Timestampable',
  function($firebaseObject, FIREBASE_URL, BaseModel, Timestampable) {
    // create a new service based on $firebaseObject
    let Profile = BaseModel('profiles', {
      // these methods exist on the prototype, so we can access the data using `this`
      getFullName: function() {
        return `${this.firstName || ''} ${this.lastName || ''}`;
      }
    }, Timestampable);

    return Profile;
  }
]);
