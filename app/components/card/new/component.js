angular.module('Voyo').directive('cardNew', function($window, S3Service) {
  return {
    scope: {
      card: '='
    },
    templateUrl: 'components/card/new/template.html',
    link: function(scope, element, attrs, controllers) {

    }
  }

})
