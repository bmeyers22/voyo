angular.module('Voyo').directive('storyCard', function($window, S3Upload) {
  return {
    scope: {
      story: '='
    },
    templateUrl: 'components/story/card/template.html',
    link: function(scope, element, attrs, controllers) {

    }
  }

})
