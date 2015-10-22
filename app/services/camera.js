angular.module('Voyo.services').service('Camera', function ($cordovaCamera) {
  return {
    getPicture: function (options) {

      return $cordovaCamera.getPicture(options);
    }
  }
});
