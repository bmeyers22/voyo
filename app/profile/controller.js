angular.module('Voyo.controllers').controller('ProfileController', function ($scope, Auth, Camera, currentAuth) {
  console.log(currentAuth);
  $scope.logout = function () {
    Auth.logout();
  }
});
