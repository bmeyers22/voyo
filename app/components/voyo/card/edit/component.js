angular.module('Voyo').directive('voyoCardNew', function($window) {
  return {
    scope: {
      voyo: '=',
      chapters: '='
    },
    templateUrl: 'components/voyo/card/edit/template.html',
    controller: ['$scope', function($scope) {

    }],
    link: function(scope, element, attrs, controllers) {
    }
  }

})
