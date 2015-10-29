angular.module('Voyo').directive('imageSwapper', function($interval) {
  return {
    scope: {
      textStr: '='
    },
    templateUrl: 'components/image-swapper/template.html',
    controller: ['$scope', function($scope) {
      $scope.images = [
        {
          url: "assets/img/city.jpg",
          color: "light"
        },
        {
          url: "assets/img/water.jpg",
          color: "dark",
          active: true
        },
        {
          url: "assets/img/forest.jpg",
          color: "light"
        }
      ];
      $scope.currentImage = $scope.images[1];
    }],
    link: function(scope, element, attrs, controllers) {
      $(element.find('img')[0]).addClass('active');
      let swapImages = function () {
        scope.currentImage.active = false;
        let currentIndex = scope.images.indexOf(scope.currentImage),
          nextIndex = currentIndex + 1 === scope.images.length ? 0 : currentIndex + 1;
        scope.currentImage = scope.images[nextIndex];
        scope.currentImage.active = true;
      };
      let timer = $interval(swapImages, 4000);
      scope.$on("$destroy", function() {
        if (timer) {
          $interval.cancel(timer);
        }
      });
    }
  }
});
