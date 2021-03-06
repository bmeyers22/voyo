angular.module('Voyo').factory("User", ["$firebaseObject", 'FIREBASE_URL', 'BaseModel', 'Timestampable',
  function($firebaseObject, FIREBASE_URL, BaseModel, Timestampable) {
    // create a new service based on $firebaseObject
    let User = BaseModel('users', {
      // these methods exist on the prototype, so we can access the data using `this`
      getFullName: function() {
        return `${this.firstName || ''} ${this.lastName || ''}`;
      }
    }, Timestampable);

    return User;
  }
]);
