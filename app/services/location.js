angular.module('Voyo.services').service('LocationService', function ($window, $cordovaGeolocation, lodash) {
    // upload later on form submit or something similar

    let getPlacesService = function () {
        return new google.maps.places.PlacesService($('<div>')[0]);
      },
      getGeocoder = function() {
        return new google.maps.Geocoder
      },
      relevantTypes = function () {
        return [
          'locality',
          'administrative_area_level_1',
          'country'
        ]
      },
      geometryToJson = function (geometry) {
        return {
          location: {
            lat: geometry.location.lat(),
            lng: geometry.location.lng()
          }
        }
      }


    return {
      // upload on file select or drop
      getCurrentLocation() {
        return $cordovaGeolocation.getCurrentPosition({
          enableHighAccuracy: true
        });
      },
      getGeocodeLocation() {
        return this.getCurrentLocation().then( (result) => {
          return new Promise((resolve, reject) => {
            let geocoder = getGeocoder();
            // Create the PlaceService and send the request.
            // Handle the callback with an anonymous function.
            var location = new google.maps.LatLng(result.coords.latitude, result.coords.longitude),
              request = {
                location: location
              };

            geocoder.geocode(request, function(results, status) {
              if (status === google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                  let names = lodash.chain(results[0].address_components)
                    .filter((obj) => {
                      return lodash.intersection(obj.types, relevantTypes()).length
                    })
                    .pluck('long_name')
                    .value();
                  resolve({
                    name: names.join(', '),
                    data: results[0]
                  })
                } else {
                  console.info('No results found');
                }
              } else {
                console.error('Geocoder failed due to: ' + status);
              }
            });
          });
        });
      },
      getNearestPlace() {
        return this.getCurrentLocation().then( (result) => {
          return new Promise((resolve, reject) => {
            // Create the PlaceService and send the request.
            // Handle the callback with an anonymous function.
            var location = new google.maps.LatLng(result.coords.latitude, result.coords.longitude),
              request = {
                location: location,
                rankBy: google.maps.places.RankBy.DISTANCE,
                types: ['restaurant', 'food', 'store']
              },
              service = getPlacesService();

            service.nearbySearch(request, function(results, status) {
              if (status == google.maps.places.PlacesServiceStatus.OK) {
                let result = results[0],
                  place = {
                    geometry: geometryToJson(result.geometry),
                    icon: result.icon,
                    name: result.name,
                    place_id: result.place_id,
                    vicinity: result.vicinity
                  }
                resolve(place);
              } else {
                resolve(null);
              }
            });

          });
        });
      }
    }
});
