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
      let threshold = 0.8;
      let checkScroll = function () {
        console.log("CHECKING SCROLL")
        var card = element[0];
        var x = 0,
            y = 0,
            w = card.offsetWidth,
            h = card.offsetHeight,
            r, //right
            b, //bottom
            visibleX, visibleY, visible,
            parent;

        parent = card;
        while (parent && parent !== document.body) {
          x += parent.offsetLeft;
          y += parent.offsetTop;
          parent = parent.offsetParent;
        }

        r = x + w;
        b = y + h;

        visibleX = Math.max(0, Math.min(w, $window.pageXOffset + $window.innerWidth - x, r - $window.pageXOffset));
        visibleY = Math.max(0, Math.min(h, $window.pageYOffset + $window.innerHeight - y, b - $window.pageYOffset));

        visible = visibleX * visibleY / (w * h);

        if (visible > threshold) {
          scope.play()
        } else {
          scope.pause();
        }
      };

      scope.videoEl = element[0];

      scope.togglePlay = function (videoEl) {
        if (videoEl.paused) {
          scope.play(videoEl);
        } else {
          scope.pause(videoEl);
        }
      }
      scope.play = function () {
        scope.videoEl.play();
      }
      scope.pause = function () {
        scope.videoEl.pause();
      }

      element.on('click', function (e) {
        scope.togglePlay(this);
      });

      let scrollEl = $('.dashboard-content-wrapper.scroll-content')
      scrollEl.on('scroll', checkScroll);

      checkScroll();

    }
  }
});
