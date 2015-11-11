angular.module('Voyo').directive('cardPreviewGrid', function($window, lodash) {
  return {
    scope: {
      voyo: '=',
      cards: '=',
      editable: '='
    },
    templateUrl: 'components/card-preview-grid/template.html',
    controller: ['$scope', function($scope) {
      angular.extend($scope, {
        sortGroups(cards) {
          let sorted = lodash.sortBy(cards, function (card) {
            return card.gridPosition;
          })
          return [
            [sorted[0], sorted[1]],
            [sorted[2], sorted[3]]
          ]
        },
        groups: []
      });
    }],
    link: function(scope, element, attrs, controllers) {
      // scope.$watch('cards', () => {
        scope.groups = scope.sortGroups(scope.cards);
      // }, true);
    }
  }

})
