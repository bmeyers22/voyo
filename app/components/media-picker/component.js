angular.module('Voyo').directive('mediaPicker', function($compile, $q, $window, MediaCaptureService, S3Upload) {
  return {
    scope: true,
    controller: ['$scope', function($scope) {

      let updateMediaUrl = function (url) {
        debugger
        $scope.$emit('PickedMediaFile', url);
      }

      $scope.testGetMedia = function() {
        $scope.$emit('PickedMediaFile', 'assets/img/login-bg.jpg');
      }

      $scope.selectMedia = function() {
        return MediaCaptureService.selectMedia()
          .then( updateMediaUrl, (err) => {
            debugger
            console.error(err)
          });
      }

      $scope.takePhoto = function () {
        return MediaCaptureService.takePhoto()
          .then( updateMediaUrl, (err) => {
            console.error(err)
          })
      }

      $scope.takeVideo = function () {
        return MediaCaptureService.takeVideo()
          .then( updateMediaUrl, (err) => {
            console.error(err)
          });
      }
    }],
    link: function(scope, element, attrs, controllers) {
    },
    templateUrl: 'components/media-picker/template.html'
  };
})
