angular.module('Voyo').directive('voyoMap', function($compile) {
  return {
    scope: true,
    controller: ['$scope', function($scope) {
      $scope.centerOnMe = function() {
        if(!$scope.map) {
          return;
        }

        navigator.geolocation.getCurrentPosition(function(pos) {
          $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
        }, function(error) {
          alert('Unable to get location: ' + error.message);
        });
      };

      $scope.clickTest = function() {
        alert('Example of infowindow with on-tap')
      };

    }],
    link: function(scope, element, attrs, controllers) {
      let myLatlng = new google.maps.LatLng(43.07493,-89.381388);

      let mapOptions = {
        center: myLatlng,
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      let map = new google.maps.Map(element.find('.map-element')[0], mapOptions);

      //Marker + infowindow + angularjs compiled on-tap
      let contentString = "<div><a on-tap='clickTest()'>Click me!</a></div>";
      let compiled = $compile(contentString)(scope);

      let infowindow = new google.maps.InfoWindow({
        content: compiled[0]
      });

      let marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        title: 'Uluru (Ayers Rock)'
      });

      google.maps.event.addListener(marker, 'click', function() {
        $scope.$apply(function () {
          infowindow.open(map,marker);
        })
      });

      scope.map = map;
    },
    templateUrl: 'components/voyo-map/template.html'
  };
})
