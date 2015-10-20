angular.module('Voyo').factory("User", ["$firebaseObject", 'FIREBASE_URL',
  function($firebaseObject, FIREBASE_URL) {
    // create a new service based on $firebaseObject
    let User = $firebaseObject.$extend({
      // these methods exist on the prototype, so we can access the data using `this`
      getFullName: function() {
        return this.firstName + " " + this.lastName;
      }
    });
    return function(userId) {
      var ref = new Firebase(`${FIREBASE_URL}users/`).child(userId);
      // create an instance of User (the new operator is required)
      return new User(ref);
    }
  }
]);
