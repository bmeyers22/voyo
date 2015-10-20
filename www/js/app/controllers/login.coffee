angular.module('Voyo.controllers').controller 'LoginCtrl', ($scope, Auth, $ionicPopup, $state, currentAuth) ->

  console.log currentAuth
  $scope.user =
    email: ''
    password: ''

  $scope.signIn = ->
    Auth.login $scope.user
      .then (result) ->
        $scope.user =
          email: ''
          password: ''
        $state.go 'tab.dash'
      .catch errMessage

  $scope.socialLogin = (provider) ->
    Auth.socialLogin provider

  $scope.createUser = ->
    Auth.register $scope.user
      .catch errMessage

  alertShow = (tit,msg) ->
    alertPopup = $ionicPopup.alert
      title: tit,
      template: msg

    alertPopup.then (res) ->
      # //console.log('Registrado correctamente.');

  errMessage = (err) ->
    if err and err.code
      msg = switch err.code
        when 'EMAIL_TAKEN' then 'This Email has been taken.'
        when 'INVALID_EMAIL' then 'Invalid Email.'
        when 'NETWORK_ERROR' then 'Network Error.'
        when 'INVALID_PASSWORD' then 'Invalid Password.'
        when 'INVALID_USER' then 'Invalid User.'
        else 'Unknown Error...'
    alertShow 'Error', msg

  alertShow 'Error', 'Already logged in' if Auth.signedIn()

  true
