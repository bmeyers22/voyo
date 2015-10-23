angular.module('Voyo.services').service('S3Upload', function () {
    // upload later on form submit or something similar
    let dataURItoBlob = function (dataURI) {
      // convert base64/URLEncoded data component to raw binary data held in a string
      var byteString;
      if (dataURI.split(',')[0].indexOf('base64') >= 0) {
        byteString = atob(dataURI.split(',')[1]);
      } else {
        byteString = unescape(dataURI.split(',')[1]);
      }

      // separate out the mime component
      var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

      // write the bytes of the string to a typed array
      var ia = new Uint8Array(byteString.length);
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      return new Blob([ia], {type:mimeString});
    };

    let generateCanvasDataUrl = function (canvas) {
      return canvas.toDataURL("image/png");
    };


    return {
      // upload on file select or drop
      uploadCanvas(canvas) {
        let blob = dataURItoBlob(generateCanvasDataUrl(canvas));
        //Getting the base64 encoded string, then converting into byte stream
        let bucketName = "dev.voyo",
         amazonS3Client = new AWS.S3();

        amazonS3Client.putObject({
          Bucket: bucketName,
          Key: 'post-images/somename.jpg',
          Body: blob,
          ACL: 'public-read'
        }, function (response) {
          console.log(response);
        });
      }
    }
});
