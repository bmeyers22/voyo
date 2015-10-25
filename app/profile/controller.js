angular.module('Voyo.controllers').controller('ProfileController', function ($scope, Auth) {
  $scope.logout = function () {
    Auth.logout();
  }
});
