angular.module('Voyo.controllers').controller('DashboardController', function ($scope, Story, stories) {
  $scope.stories = stories;
  $scope.doRefresh = function () {
    return Story.get().then((stories) => {
      $scope.$broadcast('scroll.refreshComplete')
      return $scope.stories = stories;
    })
  }

  $scope.$on('$ionicView.beforeLeave', function () {
    $scope.$broadcast('View:Leaving');
  })
});
