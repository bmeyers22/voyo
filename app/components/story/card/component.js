angular.module('Voyo').directive('storyCard', function($ionicPopup, $sce, $timeout) {
  return {
    scope: {
      story: '='
    },
    templateUrl: 'components/story/card/template.html',
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
      function checkLoad(video) {
        if (video.readyState === 4) {
          scope.loaded = true
        } else {
          $timeout(function () {
            checkLoad(video);
          }, 100);
        }
      }
      scope.loaded = false;
      scope.$on('Action:Share', scope.handleShare)
    }
  }

})
