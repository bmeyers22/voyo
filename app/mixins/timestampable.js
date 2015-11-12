angular.module('Voyo').factory("Timestampable", ["$firebaseObject",
  function($firebaseObject, FIREBASE_URL) {
    // create a new service based on $firebaseObject
    return {
      // these methods exist on the prototype, so we can access the data using `this`
      save() {
        if (!this.createdAt) {
          this.createdAt = new Date().getTime();
        }
        this.updatedAt = new Date().getTime();
        return new Promise((resolve, reject) => {
          $firebaseObject.prototype.$save.call(this).then(() => {
            resolve(this);
          });
        })
      }
    }
  }
]);
