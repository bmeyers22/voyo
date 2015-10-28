angular.module('Voyo').directive('storyCard', function($sce) {
  return {
    scope: {
      story: '='
    },
    templateUrl: 'components/story/card/template.html',
    controller: ['$scope', function($scope) {
    }],
    link: function(scope, element, attrs) {

      scope.isVideo = function () {
        return /.quicktime$/.test(scope.story.media);
      }

    }
  }

})
