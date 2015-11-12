angular.module('Voyo').directive('cardPreviewGrid', function($window, lodash, Voyo) {
  return {
    scope: {
      voyo: '=',
      chapters: '=?',
      editable: '='
    },
    templateUrl: 'components/card-preview-grid/template.html',
    controller: ['$scope', function($scope) {
      angular.extend($scope, {
        sortGroups(chapters) {
          return lodash.chain(chapters)
            .sortBy(function (chapter) {
              return chapter.gridPosition;
            })
            .chunk(2)
            .value();
        },
        groups: [],
        editChapter(chapter) {
          if (!$scope.editable) return;
          $scope.$emit('Chapter:edit', chapter);
        }
      });
    }],
    link: function(scope, element, attrs, controllers) {
      scope.$watch('chapters.length', () => {
        scope.groups = scope.sortGroups(scope.chapters);
      }, true);
      if (!scope.chapters) {
        Voyo.chapters(scope.voyo).then((chapters) => {
          scope.chapters = chapters;
        })
      }
    }
  }

})
