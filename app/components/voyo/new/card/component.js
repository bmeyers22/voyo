angular.module('Voyo').directive('voyoCardNew', function($window) {
  return {
    scope: {
      voyo: '=',
      cards: '='
    },
    templateUrl: 'components/voyo/new/card/template.html',
    controller: ['$scope', function($scope) {

    }],
    link: function(scope, element, attrs, controllers) {

    }
  }

})
