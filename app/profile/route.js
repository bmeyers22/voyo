angular.module('Voyo')
  .config( function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app.tabs.profile', {
      url: '/profile',
      views: {
        'tabs-profile': {
          templateUrl: 'profile/template.html',
          controller: 'ProfileController'
        }
      },
      resolve: {
        currentUser: ['currentUser', function (currentUser) {
          return currentUser;
        }],
        profile: ['$state', 'Auth', 'Profile', 'currentAuth', function ($state, Auth, Profile, currentAuth) {
          return Profile.find(currentAuth.uid).$loaded();
        }]
      }
    });
  });
