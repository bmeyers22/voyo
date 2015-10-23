angular.module('Voyo.controllers').controller('AdminCameraController', function ($scope, $window, Camera, $cordovaFile) {
  $scope.getPhoto = function () {
    Camera.getPicture({
      quality: 75,
      targetWidth: 320,
      targetHeight: 320,
      allowEdit : true,
      saveToPhotoAlbum: true
    }).then( (imageURI) => {
      $scope.photoUrl = imageURI;
    }, (err) => {
      console.error(err)
    })
  }
  $scope.photoUrl = 'assets/img/login-bg.jpg';
});
