angular.module('Voyo.controllers').controller 'DashCtrl', ($scope, Camera) ->
  $scope.getPhoto = ->
    Camera.getPicture().then (imageURI) ->
      console.log(imageURI)
    , (err) ->
      console.error(err)
