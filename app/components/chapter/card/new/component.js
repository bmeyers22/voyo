angular.module('Voyo').directive('chapterCardNew', function($window, S3Service) {
  return {
    scope: {
      chapter: '='
    },
    templateUrl: 'components/chapter/card/new/template.html',
    link: function(scope, element, attrs, controllers) {

    }
  }

})
