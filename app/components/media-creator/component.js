angular.module('Voyo').directive('mediaCreator', function($compile, $q, $window, Camera, S3Upload) {
  return {
    scope: {
      photoUrl: '='
    },
    controller: ['$scope', function($scope) {
      $scope.currentFilter = null;

      $scope.size = {
        width: $window.innerWidth,
        height: $window.innerWidth
      }
      $scope.thumbSize = {
        width: 64,
        height: 64
      }

      $scope.getPhoto = function () {
        Camera.getPicture({
          quality: 75,
          targetWidth: $window.innerWidth,
          targetHeight: $window.innerWidth,
          allowEdit : true,
          saveToPhotoAlbum: true
        }).then( (imageURI) => {
          $scope.photoUrl = imageURI;
        }, (err) => {
          console.error(err)
        })
      }
      $scope.photoUrl = 'assets/img/login-bg.jpg';


      $scope.applyFilter = function (filter) {
        if (filter === $scope.currentFilter) {
          return;
        }
        $scope.filters[filter]();
        $scope.currentFilter = filter;
      }

      $scope.filters = {
        reset: function(selector, size) {
          let string = selector || '.image-element.main';
          Caman(string, function(){
            this.revert(false);
            if (size) {
              this.resize(size);
            }
            this.render();
          });
        },
        brightness: function(selector, size) {
          let string = selector || '.image-element.main';
          Caman(string, function(){
            this.revert(false);
            if (size) {
              this.resize(size);
            }
            this.brightness(10);
            this.contrast(0);
            this.render(function(){
              // some callback function after rendering
            });
          });
        },
        noise: function(selector, size) {
          let string = selector || '.image-element.main';
          Caman(string, function(){
            this.revert(false);
            if (size) {
              this.resize(size);
            }
            this.noise(10);
            this.render();
          });
        },
        contrast: function(selector, size) {
          let string = selector || '.image-element.main';
          Caman(string, function(){
            this.revert(false);
            if (size) {
              this.resize(size);
            }
            this.contrast(10);
            this.render();
          });
        },
        sepia: function(selector, size) {
          let string = selector || '.image-element.main';
          Caman(string, function(){
            this.revert(false);
            if (size) {
              this.resize(size);
            }
            this.sepia(20);
            this.render();
          });
        },
        color: function(selector, size) {
          let string = selector || '.image-element.main';
          Caman(string, function(){
            this.revert(false);
            if (size) {
              this.resize(size);
            }
            this.colorize("#3c69da", 10);
            this.render();
          });
        }

      }

    }],
    link: function(scope, element, attrs, controllers) {
      scope.resetMain = function () {
        let holder = element.find('.image-holder.main'),
          img = new Image();
        $(img).css(scope.size);
        img.src = scope.photoUrl;
        img.className = 'image-element main';
        holder.children().remove()
        holder.append(img);
        Caman('.image-element.main', function () {
          this.resize(scope.size);
          this.render();
        });
      }

      scope.resetThumbs = function () {
        element.find('.thumbs .image-holder').each(function () {
          let filter = $(this).data('filter');
          let img = new Image();
          $(img).css(scope.thumbSize);
          img.src = scope.photoUrl;
          img.className = `image-element ${filter}`;
          $(this).children().remove()
          $(this).append(img);
          scope.filters[filter](`.image-element.${filter}`, scope.thumbSize);
        })
      }

      scope.resetImages = function () {
        scope.resetMain();
        scope.resetThumbs();
      }

      scope.saveImage = function () {
        let canvas = element.find('.image-element.main')[0];
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
        console.log(S3Upload.uploadCanvas(canvas));
      }


      scope.$watch('photoUrl', function (val, old) {
        scope.resetImages();
      });

    },
    templateUrl: 'components/media-creator/template.html'
  };
})
