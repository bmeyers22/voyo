angular.module('Voyo.controllers').controller('CardEditFiltersController', function ($scope, $state, $window, S3Service, Card, card) {

  $scope.saveMedia = function () {
    let prom;
    if ($scope.mediaType === 'image') {
      prom = $scope.saveImage()
    } else if ($scope.mediaType === 'video') {
      prom = $scope.saveVideo()
    }
    return prom.then(function (url) {
      card.media = url;
      return card;
    }).then(function () {
      $state.go('app.voyo.card.new.details');
    })
  }

  $scope.saveImage = function () {
    let canvas = $('.image-element.main')[0];
    if ($window.canvas2ImagePlugin) {
      $window.canvas2ImagePlugin.saveImageDataToLibrary(
        function(msg){
            console.log(msg);
        },
        function(err){
            console.log(err);
        },
        canvas
      );
    }
    return S3Service.uploadCanvas(canvas, card.$id);
  }

  $scope.saveVideo = function () {
    return S3Service.uploadVideo($scope.mediaUrl, card.$id);
  }

});
