angular.module('Voyo.controllers').controller('DashboardController', function ($scope, Auth, Camera, currentUser) {
  $scope.currentUser = currentUser;
  $scope.getPhoto = function () {
    Camera.getPicture().then( (imageURI) => {
      console.log(imageURI);
    }, (err) => {
      console.error(err)
    })
  }
});
