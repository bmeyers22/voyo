angular.module('Voyo.controllers').controller('DashboardController', function ($scope, Voyo, voyos) {
  $scope.voyos = voyos;
  $scope.doRefresh = function () {
    return Voyo.get().then((voyos) => {
      $scope.$broadcast('scroll.refreshComplete')
      return $scope.voyos = voyos;
    })
  }

  $scope.$on('$ionicView.beforeLeave', function () {
    $scope.$broadcast('View:Leaving');
  })
});
