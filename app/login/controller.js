angular.module('Voyo.controllers').controller('LoginController', function ($scope, Auth, $ionicPopup, $state, currentAuth) {

  console.log(currentAuth);
  $scope.user = {
    email: '',
    password: ''
  };

  $scope.signIn = function () {
    Auth.login($scope.user)
      .then( (result) => {
        $scope.user = {
          email: '',
          password: ''
        };
        $state.go('app.tabs.dash');
      }).catch(errMessage)
  };

  $scope.socialLogin = function (provider) {
    Auth.socialLogin(provider).then( () => {
      $scope.user = {
        email: '',
        password: ''
      };
      $state.go('app.tabs.dash');
    });
  };

  $scope.createUser = function () {
    Auth.register($scope.user)
      .then( (user) => {
        $state.go('app.tabs.dash');
      })
      .catch(errMessage);
  };

  let alertShow = function (tit,msg) {
    $ionicPopup.alert({
      title: tit,
      template: msg
    }).then( (res) => {

    });
  };

  let errMessage = function (err) {}
    // if err and err.code
    //   msg = switch err.code
    //     when 'EMAIL_TAKEN' then 'This Email has been taken.'
    //     when 'INVALID_EMAIL' then 'Invalid Email.'
    //     when 'NETWORK_ERROR' then 'Network Error.'
    //     when 'INVALID_PASSWORD' then 'Invalid Password.'
    //     when 'INVALID_USER' then 'Invalid User.'
    //     else 'Unknown Error...'
    // alertShow 'Error', msg
});
