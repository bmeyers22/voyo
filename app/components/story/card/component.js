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
      scope.story.$loaded().then(() => {
        scope.isVideo = /.quicktime$/.test(scope.story.media);
        $timeout(function () {
          let el, evName;
          if (scope.isVideo) {
            el = element.find('video');
            evName = 'loadeddata';
            checkLoad(el[0])
          } else {
            el = element.find('img');
            evName = 'load';
          }
          if (el[0].complete) {
            scope.loaded = true
          } else {
            el.on(evName, () => {
              scope.loaded = true
            })
          }
        }, 1);
      })
    }
  }

})
