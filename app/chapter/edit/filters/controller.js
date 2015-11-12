angular.module('Voyo.controllers').controller('ChapterEditFiltersController', function ($scope, $state, $window, S3Service, Chapter, chapter) {

  $scope.saveMedia = function () {
    let prom;
    if ($scope.mediaType === 'image') {
      prom = $scope.saveImage()
    } else if ($scope.mediaType === 'video') {
      prom = $scope.saveVideo()
    }
    return prom.then(function (url) {
      chapter.media = url;
      return chapter;
    }).then(function () {
      $state.go('app.voyo.edit.chapter.details');
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
    return S3Service.uploadCanvas(canvas, chapter.$id);
  }

  $scope.saveVideo = function () {
    return S3Service.uploadVideo($scope.mediaUrl, chapter.$id);
  }

});
