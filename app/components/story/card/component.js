angular.module('Voyo').directive('storyCard', function($sce, $window, S3Upload) {
  return {
    scope: {
      story: '='
    },
    templateUrl: 'components/story/card/template.html',
    link: function(scope, element, attrs, controllers) {
      scope.isVideo = function () {
        return /.quicktime$/.test(scope.story.media);
      }
      scope.trustSrc = function(src) {
        return $sce.trustAsResourceUrl(src);
      }
    }
  }

})
