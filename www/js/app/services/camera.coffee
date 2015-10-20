angular.module('Voyo.services').factory 'Camera', ['$q', ($q) ->
  getPicture: (options) ->
    q = $q.defer()

    navigator.camera.getPicture (result) ->
      q.resolve(result)
    , (err) ->
      q.reject(err)
    , options

    q.promise
]
