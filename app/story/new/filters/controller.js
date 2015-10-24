angular.module('Voyo.controllers').controller('StoryNewFiltersController', function ($scope, $state, $window, S3Upload, story) {
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
    S3Upload.uploadCanvas(canvas).then( (url) => {
      story.media = url;
      story.save().then( (story) => {
        $state.go('app.story.new.details');
      });
    });
  }

});
