angular.module('Voyo').directive('mediaPicker', function($compile, $q, $window, MediaCaptureService, S3Service) {
  return {
    scope: true,
    controller: ['$scope', function($scope) {

      let updateMediaUrl = function (url, type) {
        $scope.$emit('PickedMediaFile', url, type);
      }

      $scope.testGetMedia = function() {
        $scope.$emit('PickedMediaFile', 'assets/img/login-bg.jpg', 'image');
      }

      $scope.selectMedia = function() {
        return MediaCaptureService.selectMedia()
          .then( function (url) {
            updateMediaUrl(url, 'image');
          }, (err) => {
            console.error(err)
          });
      }

      $scope.takePhoto = function () {
        return MediaCaptureService.takePhoto()
          .then( function (url) {
            updateMediaUrl(url, 'image');
          }, (err) => {
            console.error(err)
          })
      }

      $scope.takeVideo = function () {
        return MediaCaptureService.takeVideo()
          .then( function (videos) {
            updateMediaUrl(videos[0].fullPath, 'video');
          }, (err) => {
            console.error(err)
          });
      }
    }],
    link: function(scope, element, attrs, controllers) {
    },
    templateUrl: 'components/media-picker/template.html'
  };
})
