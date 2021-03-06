// // Ionic Starter App
//
// // angular.module is a global place for creating, registering and retrieving Angular modules
// // 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// // the 2nd parameter is an array of 'requires'
// // 'starter.services' is found in services.js
// // 'starter.controllers' is found in controllers.js
window.VOYO = angular.module('Voyo', [
  'ionic',
  'ion-affix',
  'angularMoment',
  'ngAnimate',
  'ngCordova',
  'ngLodash',
  'firebase',
  'Voyo.controllers',
  'Voyo.services',
  'templates'
])
.constant('FIREBASE_URL', 'https://voyo.firebaseio.com/')
.run( function ($ionicPlatform, $cordovaStatusbar, $rootScope, Auth) {
  $ionicPlatform.ready( function () {
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true)
      cordova.plugins.Keyboard.disableScroll(true)
    }

    if (window.cordova) {
      $cordovaStatusbar.overlaysWebView(true)
      $cordovaStatusbar.style(3);
    }

  });
});
