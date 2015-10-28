angular.module('Voyo').directive('fuzzyTime', function(amMoment, $interval) {
  return {
    scope: {
      date: '='
    },
    templateUrl: 'components/fuzzy-time/template.html',
    link: function(scope, element, attrs, controllers) {
      let setTime = function () {
        scope.timeAgo = moment(scope.date).fromNow();
      }
      $interval(setTime, 60000);
      setTime();
    },
  }
});
