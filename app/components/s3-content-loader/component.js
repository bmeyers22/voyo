angular.module('Voyo').directive('s3ContentLoader', function(S3Service, $timeout) {
  return {
    scope: {
      mediaUrl: '='
    },
    templateUrl: 'components/s3-content-loader/template.html',
    controller: ['$scope', function($scope) {
      $scope.showAlert = function(options) {
        return $ionicPopup.alert(options);
      };
      $scope.handleShare = function (e, provider) {
        $scope.showAlert({
          title: 'Sharing',
          template: `You tried to share to ${provider}`
        });
      }
    }],
    link: function(scope, element, attrs) {
      scope.$watch('mediaUrl', function (url) {
        if (url) {
          S3Service.getMediaRequest(scope.mediaUrl)
            .on('success', function(response) {
              scope.isVideo = /video/.test(response.data.ContentType);
              scope.loaded = true
              scope.src = `data:${response.data.ContentType};base64,${AWS.util.base64.encode(response.data.Body)}`;
              console.log("Success!");
            })
            .on('error', function(response) {
              console.log("Error!");
            })
            .on('httpDownloadProgress', function(progress, response) {
              console.log("Progress!", `${progress.loaded/progress.total*100}%`);
            })
            .on('complete', function(response) {
              console.log("DATA!", response);
              console.log("Always!");
            })
            .send();
        }

      })

    }
  }

})
