angular.module('Voyo.controllers').controller('ProfileController', function ($scope, Auth, currentUser, profile, lodash) {
  profile.$bindTo($scope, 'profile');
  $scope.currentUser = currentUser;
  // $scope.name = `${$scope.profile.firstName} ${$scope.profile.lastName}`;
  $scope.custom = {
    name: `${profile.firstName} ${profile.lastName}`
  }
  $scope.updateNames = function () {
    let names = $scope.custom.name.split(' ');
    if ($scope.profile) {
      $scope.profile.firstName = names[0];
      $scope.profile.lastName = names.slice(1).join('')
    }
  }
  $scope.logout = function () {
    Auth.logout();
  }
});
