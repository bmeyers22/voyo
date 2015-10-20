angular.module('Voyo.controllers').controller 'DashCtrl', ($scope, Auth, Camera, currentAuth) ->
  console.log(currentAuth)
  $scope.getPhoto = ->
    Camera.getPicture().then (imageURI) ->
      console.log(imageURI)
    , (err) ->
      console.error(err)
