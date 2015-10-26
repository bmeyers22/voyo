angular.module('Voyo.controllers').controller('StoryNewFiltersController', function ($scope, $state, $window, S3Upload, story) {

  $scope.saveMedia = function () {
    if ($scope.mediaType === 'image') {
      $scope.saveImage()
    } else if ($scope.mediaType === 'video') {
      $scope.saveVideo()
    }
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
    S3Upload.uploadCanvas(canvas, story.$id).then( (url) => {
      story.media = url;
      story.save().then( (story) => {
        $state.go('app.story.new.details');
      });
    });
  }

  $scope.saveVideo = function () {
    return S3Upload.uploadVideo($scope.mediaUrl, story.$id).then( (url) => {
      story.media = url;
      story.save().then( (story) => {
        $state.go('app.story.new.details');
      });
    });
  }

});
