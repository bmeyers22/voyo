window.VOYO = angular.module('Voyo', ['ionic', 'firebase', 'Voyo.controllers', 'Voyo.services']);

VOYO.run(function($ionicPlatform) {
  return $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      return StatusBar.styleLightContent();
    }
  });
});

VOYO.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider.state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  }).state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  }).state('tab.chats', {
    url: '/chats',
    views: {
      'tab-chats': {
        templateUrl: 'templates/tab-chats.html',
        controller: 'ChatsCtrl'
      }
    }
  }).state('tab.chat-detail', {
    url: '/chats/:chatId',
    views: {
      'tab-chats': {
        templateUrl: 'templates/chat-detail.html',
        controller: 'ChatDetailCtrl'
      }
    }
  }).state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });
  return $urlRouterProvider.otherwise('/tab/dash');
});

angular.module('Voyo.controllers', []);

angular.module('Voyo.services', []);

angular.module('Voyo.controllers').controller('DashCtrl', function($scope, Camera) {
  return $scope.getPhoto = function() {
    return Camera.getPicture().then(function(imageURI) {
      return console.log(imageURI);
    }, function(err) {
      return console.error(err);
    });
  };
});

angular.module('Voyo.services').factory('Camera', [
  '$q', function($q) {
    return {
      getPicture: function(options) {
        var q;
        q = $q.defer();
        navigator.camera.getPicture(function(result) {
          return q.resolve(result);
        }, function(err) {
          return q.reject(err);
        }, options);
        return q.promise;
      }
    };
  }
]);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbnRyb2xsZXJzLmpzIiwic2VydmljZXMuanMiLCJjb250cm9sbGVycy9kYXNoYm9hcmQuanMiLCJzZXJ2aWNlcy9jYW1lcmEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0REE7QUFDQTtBQ0RBO0FBQ0E7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoidm95by5qcyIsInNvdXJjZXNDb250ZW50IjpbIndpbmRvdy5WT1lPID0gYW5ndWxhci5tb2R1bGUoJ1ZveW8nLCBbJ2lvbmljJywgJ2ZpcmViYXNlJywgJ1ZveW8uY29udHJvbGxlcnMnLCAnVm95by5zZXJ2aWNlcyddKTtcblxuVk9ZTy5ydW4oZnVuY3Rpb24oJGlvbmljUGxhdGZvcm0pIHtcbiAgcmV0dXJuICRpb25pY1BsYXRmb3JtLnJlYWR5KGZ1bmN0aW9uKCkge1xuICAgIGlmICh3aW5kb3cuY29yZG92YSAmJiB3aW5kb3cuY29yZG92YS5wbHVnaW5zICYmIHdpbmRvdy5jb3Jkb3ZhLnBsdWdpbnMuS2V5Ym9hcmQpIHtcbiAgICAgIGNvcmRvdmEucGx1Z2lucy5LZXlib2FyZC5oaWRlS2V5Ym9hcmRBY2Nlc3NvcnlCYXIodHJ1ZSk7XG4gICAgICBjb3Jkb3ZhLnBsdWdpbnMuS2V5Ym9hcmQuZGlzYWJsZVNjcm9sbCh0cnVlKTtcbiAgICB9XG4gICAgaWYgKHdpbmRvdy5TdGF0dXNCYXIpIHtcbiAgICAgIHJldHVybiBTdGF0dXNCYXIuc3R5bGVMaWdodENvbnRlbnQoKTtcbiAgICB9XG4gIH0pO1xufSk7XG5cblZPWU8uY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcbiAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3RhYicsIHtcbiAgICB1cmw6ICcvdGFiJyxcbiAgICBhYnN0cmFjdDogdHJ1ZSxcbiAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy90YWJzLmh0bWwnXG4gIH0pLnN0YXRlKCd0YWIuZGFzaCcsIHtcbiAgICB1cmw6ICcvZGFzaCcsXG4gICAgdmlld3M6IHtcbiAgICAgICd0YWItZGFzaCc6IHtcbiAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvdGFiLWRhc2guaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdEYXNoQ3RybCdcbiAgICAgIH1cbiAgICB9XG4gIH0pLnN0YXRlKCd0YWIuY2hhdHMnLCB7XG4gICAgdXJsOiAnL2NoYXRzJyxcbiAgICB2aWV3czoge1xuICAgICAgJ3RhYi1jaGF0cyc6IHtcbiAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvdGFiLWNoYXRzLmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnQ2hhdHNDdHJsJ1xuICAgICAgfVxuICAgIH1cbiAgfSkuc3RhdGUoJ3RhYi5jaGF0LWRldGFpbCcsIHtcbiAgICB1cmw6ICcvY2hhdHMvOmNoYXRJZCcsXG4gICAgdmlld3M6IHtcbiAgICAgICd0YWItY2hhdHMnOiB7XG4gICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL2NoYXQtZGV0YWlsLmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnQ2hhdERldGFpbEN0cmwnXG4gICAgICB9XG4gICAgfVxuICB9KS5zdGF0ZSgndGFiLmFjY291bnQnLCB7XG4gICAgdXJsOiAnL2FjY291bnQnLFxuICAgIHZpZXdzOiB7XG4gICAgICAndGFiLWFjY291bnQnOiB7XG4gICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL3RhYi1hY2NvdW50Lmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnQWNjb3VudEN0cmwnXG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy90YWIvZGFzaCcpO1xufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnVm95by5jb250cm9sbGVycycsIFtdKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdWb3lvLnNlcnZpY2VzJywgW10pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ1ZveW8uY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdEYXNoQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgQ2FtZXJhKSB7XG4gIHJldHVybiAkc2NvcGUuZ2V0UGhvdG8gPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gQ2FtZXJhLmdldFBpY3R1cmUoKS50aGVuKGZ1bmN0aW9uKGltYWdlVVJJKSB7XG4gICAgICByZXR1cm4gY29uc29sZS5sb2coaW1hZ2VVUkkpO1xuICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgcmV0dXJuIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICB9KTtcbiAgfTtcbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ1ZveW8uc2VydmljZXMnKS5mYWN0b3J5KCdDYW1lcmEnLCBbXG4gICckcScsIGZ1bmN0aW9uKCRxKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGdldFBpY3R1cmU6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIHE7XG4gICAgICAgIHEgPSAkcS5kZWZlcigpO1xuICAgICAgICBuYXZpZ2F0b3IuY2FtZXJhLmdldFBpY3R1cmUoZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgICAgcmV0dXJuIHEucmVzb2x2ZShyZXN1bHQpO1xuICAgICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICByZXR1cm4gcS5yZWplY3QoZXJyKTtcbiAgICAgICAgfSwgb3B0aW9ucyk7XG4gICAgICAgIHJldHVybiBxLnByb21pc2U7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXSk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
