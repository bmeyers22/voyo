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
          return lodash.chain(cards)
            .sortBy(function (card) {
              return card.gridPosition;
            }).chunk(2);
        },
        groups: [],
        editCard(card) {
          $scope.$emit('Card:edit', card);
        }
      });
    }],
    link: function(scope, element, attrs, controllers) {
      // scope.$watch('cards', () => {
        scope.groups = scope.sortGroups(scope.cards);
      // }, true);
    }
  }

})
