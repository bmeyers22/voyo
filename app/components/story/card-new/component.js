angular.module('Voyo').directive('storyCardNew', function($window, S3Upload) {
  return {
    scope: {
      story: '='
    },
    templateUrl: 'components/story/card-new/template.html',
    link: function(scope, element, attrs, controllers) {

    }
  }

})
