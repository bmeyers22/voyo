angular.module('Voyo.controllers').controller 'ProfileCtrl', ($scope, Auth, Camera, currentAuth) ->
  console.log(currentAuth)
  $scope.logout = ->
    Auth.logout()
