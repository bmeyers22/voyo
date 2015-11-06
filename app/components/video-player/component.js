angular.module('Voyo').directive('videoPlayer', function($sce, $window, $ionicScrollDelegate) {
  return {
    replace: true,
    scope: {
      videoUrl: '@'
    },
    templateUrl: 'components/video-player/template.html',
    controller: ['$scope', function($scope) {
      $scope.trustSrc = function(src) {
        return $sce.trustAsResourceUrl(src);
      }
    }],
    link: function(scope, element, attrs, ctrl) {
      let videoEl = element[0],
        waypoint = new Waypoint.Inview({
          element: videoEl,
          context: $('.dashboard-content-wrapper.scroll-content')[0],
          enter: function(direction) {
            // notify('Enter triggered with direction ' + direction)
          },
          entered: function(direction) {
            if (!scope.userInteracted) {
              scope.play();
            }
          },
          exit: function(direction) {
            scope.pause();
          },
          exited: function(direction) {
            // notify('Exited triggered with direction ' + direction)
          }
        });

      scope.togglePlay = function (videoEl) {
        if (videoEl.paused) {
          scope.play(videoEl);
        } else {
          scope.pause(videoEl);
        }
        scope.userInteracted = true;
      }
      scope.play = function () {
        videoEl.play();
      }
      scope.pause = function () {
        videoEl.pause();
      }

      element.on('click', function (e) {
        scope.togglePlay(this);
      });
      scope.$on('View:Leaving', scope.pause);
    }
  }
});
