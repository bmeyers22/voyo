angular.module('Voyo').directive('mediaCreator', function($compile, $q) {
  return {
    scope: {
      photoUrl: '='
    },
    controller: ['$scope', function($scope) {
      $scope.currentFilter = null;

      $scope.size = {
        width: 320,
        height: 320
      }

      $scope.applyFilter = function (filter) {
        if (filter === $scope.currentFilter) {
          return;
        }
        $scope.filters[filter]();
        $scope.currentFilter = filter;
      }

      $scope.filters = {
        reset: function(selector) {
          let string = selector || '.image-element.main';
          Caman(string, function(){
            this.revert(false);
            this.render();
          });
        },
        brightness: function(selector) {
          let string = selector || '.image-element.main';
          Caman(string, function(){
            this.revert(false);
            this.brightness(10);
            this.contrast(0);
            this.render(function(){
              // some callback function after rendering
            });
          });
        },
        noise: function(selector) {
          let string = selector || '.image-element.main';
          Caman(string, function(){
            this.revert(false);
            this.noise(10);
            this.render();
          });
        },
        contrast: function(selector) {
          let string = selector || '.image-element.main';
          Caman(string, function(){
            this.revert(false);
            this.contrast(10);
            this.render();
          });
        },
        sepia: function(selector) {
          let string = selector || '.image-element.main';
          Caman(string, function(){
            this.revert(false);
            this.sepia(20);
            this.render();
          });
        },
        color: function(selector) {
          let string = selector || '.image-element.main';
          Caman(string, function(){
            this.revert(false);
            this.colorize("#3c69da", 10);
            // alternative syntax
            // this.colorize(60, 105, 218, 10);
            this.render();
          });
        }

      }

    }],
    link: function(scope, element, attrs, controllers) {
      scope.resetMain = function () {
        let holder = element.find('.image-holder.main'),
          img = new Image();
        img.height = scope.size.height;
        img.width = scope.size.width;
        img.src = scope.photoUrl;
        img.className = 'image-element main';
        holder.children().remove()
        holder.append(img);
        Caman('.image-element.main', function () {
          this.render();
        });
      }

      scope.resetThumbs = function () {
        element.find('.thumbs .image-holder').each(function () {
          let filter = $(this).data('filter');
          let img = new Image();
          img.height = 64;
          img.width = 64;
          img.src = scope.photoUrl;
          img.className = `image-element ${filter}`;
          $(this).children().remove()
          $(this).append(img);
          scope.filters[filter](`.image-element.${filter}`);
        })
      }

      scope.resetImages = function () {
        scope.resetMain();
        scope.resetThumbs();
      }

      scope.$watch('photoUrl', function (val, old) {
        scope.resetImages();
      });

    },
    templateUrl: 'components/media-creator/template.html'
  };
})
