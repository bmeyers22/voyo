angular.module('Voyo').factory("BaseModel", ["$firebaseObject", 'FIREBASE_URL',
  function($firebaseObject, FIREBASE_URL) {
    // create a new service based on $firebaseObject
    let defaultProperties = {
      save() {
        $firebaseObject.prototype.$save.call(this);
      }
    }

    return function (modelName, properties = {}, ...mixins) {
      let initProps = angular.extend({}, defaultProperties);
      mixins.forEach( (mixin) => {
        angular.extend(initProps, mixin);
      });
      angular.extend(initProps, properties);
      let Constr = $firebaseObject.$extend(initProps);

      let retFn = function(id) {
        var ref = new Firebase(`${FIREBASE_URL}${modelName}/`).child(id);
        // create an instance of User (the new operator is required)
        return new Constr(ref);
      };

      retFn.create = function (id, properties = {}) {
        let model = retFn(id);
        return model.$loaded().then((snapshot) => {
          angular.extend(model, properties);
          return model.save();
        });
      };
      retFn.find = function (id) {
        var ref = new Firebase(`${FIREBASE_URL}${modelName}/`).child(id);
        // create an instance of User (the new operator is required)
        return new Constr(ref);
      };
      return retFn;
    }
  }
]);
