angular.module('Voyo').directive('shareButton', function($ionicActionSheet, $timeout) {
  return {
    replace: true,
    templateUrl: 'components/story/card/share-button/template.html',
    controller: ['$scope', function($scope) {
      let buttonData = [
        {
          provider: 'facebook',
          displayText: 'Facebook'
        },
        {
          provider: 'twitter',
          displayText: 'Twitter'
        },
      ];

      $scope.share = function (provider) {
        $scope.$emit('Action:Share', provider);
      }

      $scope.show = function() {

        // Show the action sheet
        let hideSheet = $ionicActionSheet.show({
          buttons: buttonData.map((obj) => {
            return {
              text: `
                <div class="share-text ${obj.provider}-text">
                  <i class="icon ion-social-${obj.provider}"></i>
                  <span>${obj.displayText}</span>
                </div>
              `
            };
          }),
          titleText: 'Share your Voyo',
          cancelText: 'Cancel',
          cancel() {
            // add cancel code..
          },
          buttonClicked(index) {
            let provider = buttonData[index].provider;
            $scope.share(provider);
            return true;
          }
        });

      };
    }],
    link(scope, element, attrs) {
    }
  }

})
