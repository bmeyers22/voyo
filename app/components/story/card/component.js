angular.module('Voyo').directive('storyCard', function($ionicPopup, $sce) {
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
      scope.$on('Action:Share', scope.handleShare)
      scope.isVideo = function () {
        return /.quicktime$/.test(scope.story.media);
      }

    }
  }

})
