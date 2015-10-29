angular.module('Voyo').directive('fuzzyTime', function(amMoment, $interval) {
  return {
    scope: {
      date: '='
    },
    templateUrl: 'components/fuzzy-time/template.html',
    link: function(scope, element, attrs, controllers) {
      let setTime = function () {
        scope.timeAgo = moment(scope.date).fromNow();
      };
      let transformString = function (suffix) {

      };
      let timer = $interval(setTime, 60000);
      scope.$watch('date', setTime)
      scope.$on("$destroy", function() {
        if (timer) {
          $interval.cancel(timer);
        }
      });
    },
  }
});
