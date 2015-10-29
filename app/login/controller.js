angular.module('Voyo.controllers').controller('LoginController', function ($scope, $state, currentAuth) {

  console.log(currentAuth);

  $scope.$on('Login:Success', function () {
    $state.go('app.tabs.dash');
  })
});
