// // Ionic Starter App
//
// // angular.module is a global place for creating, registering and retrieving Angular modules
// // 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// // the 2nd parameter is an array of 'requires'
// // 'starter.services' is found in services.js
// // 'starter.controllers' is found in controllers.js
window.VOYO = angular.module('Voyo', ['ionic', 'ion-affix', 'ngCordova', 'firebase', 'Voyo.controllers', 'Voyo.services', 'templates'])

VOYO.constant('FIREBASE_URL', 'https://voyo.firebaseio.com/');
VOYO.run( function ($ionicPlatform, $rootScope, Auth) {
  $ionicPlatform.ready( function () {
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true)
      cordova.plugins.Keyboard.disableScroll(true)
    }

    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }

  });
});
