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
      scope.loaded = false;
      scope.$on('Action:Share', scope.handleShare)
      scope.story.$loaded().then(() => {
        scope.isVideo = /.quicktime$/.test(scope.story.media);
        $timeout(function () {
          if (scope.isVideo) {
            element.find('video').on('loadeddata', () => {
              scope.loaded = true;
            });
          } else {
            element.find('img').on('load', () => {
              scope.loaded = true;
            });
          }
        }, 1);
      })
    }
  }

})
