angular.module('Voyo.services').factory('Camera', ['$q', function ($q) {
  return {
    getPicture: function (options) {
      let q = $q.defer();

      navigator.camera.getPicture( function (result) {
        q.resolve(result);
      }, function (err) {
        q.reject(err);
      }, options );

      return q.promise;
    }
  }
}]);
