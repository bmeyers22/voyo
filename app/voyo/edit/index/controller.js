angular.module('Voyo.controllers').controller('VoyoEditIndexController', function ($ionicPopup, $scope, $state, LocationService, voyo, chapters) {
  angular.extend($scope, {
    chapters: chapters,
    voyo: voyo,
    exit() {
      $ionicPopup.confirm({
        title: 'Delete this voyo?',
        template: 'Would you like to delete this Voyo?',
        cancelText: 'Save draft',
        okText: '<i class="icon ion-trash-a"></i>',
        okType: 'button-assertive'
      }).then(function(res) {
        if(res) {
          $scope.deleteVoyo();
        } else {
          $state.go('app.tabs.dash');
        }
      });
    },
    deleteVoyo() {
      chapters.forEach((chapter) => {
        chapter.$remove();
      });
      voyo.$remove().then(function () {
        $state.go('app.tabs.dash');
      });
    }
  })

  if (!$scope.voyo.location) {
    LocationService.getGeocodeLocation().then((location) => {
      $scope.voyo.location = location;
      $scope.voyo.save();
    })
  }

});
