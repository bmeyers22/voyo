angular.module('Voyo').directive('mediaPicker', function($compile, $q, $window, Camera, S3Upload) {
  return {
    scope: true,
    controller: ['$scope', function($scope) {

      let updateMediaUrl = function (url) {
        $scope.$emit('PickedMediaFile', url);
      }

      $scope.testGetMedia = function() {
        $scope.$emit('PickedMediaFile', 'assets/img/login-bg.jpg');
      }

      $scope.getMedia = function (type) {
        Camera.getPicture({
          quality: 75,
          targetWidth: $window.innerWidth,
          targetHeight: $window.innerWidth,
          allowEdit : true,
          saveToPhotoAlbum: true
        }).then( updateMediaUrl, (err) => {
          console.error(err)
        })
      }
    }],
    link: function(scope, element, attrs, controllers) {
    },
    templateUrl: 'components/media-picker/template.html'
  };
})
