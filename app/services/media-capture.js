angular.module('Voyo.services').service('MediaCaptureService', function ($cordovaCapture, $cordovaCamera, $window) {

  let defaultOpions = function () {
    return {
      camera: {
        quality: 50,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: true,
        encodingType: Camera.EncodingType.PNG,
        targetWidth: $window.innerWidth,
        targetHeight: $window.innerWidth,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: true
      },
      photoLibrary: {
        quality: 50,
        allowEdit: true,
        encodingType: Camera.EncodingType.PNG,
        targetWidth: $window.innerWidth,
        targetHeight: $window.innerWidth,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        mediaType: Camera.MediaType.ALLMEDIA
      },
      video: {
        duration: 15
      }
    }
  };
  return {
    captureAudio(options) {
      return $cordovaCapture.captureAudio(options);
    },

    takeVideo(options = defaultOpions().video) {
      return $cordovaCapture.captureVideo(options);
    },

    takePhoto(options = defaultOpions().camera) {
      return $cordovaCamera.getPicture(options);
    },

    selectMedia(options = defaultOpions().photoLibrary) {
      return $cordovaCamera.getPicture(options);
    }
  }
});
