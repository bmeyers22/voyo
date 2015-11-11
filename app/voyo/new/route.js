angular.module('Voyo')
  .config( function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app.voyo.new', {
      cache: false,
      url: '/new',
      abstract: true,
      views: {
        'app-voyo-container': {
          templateUrl: 'voyo/new/template.html',
          controller: 'VoyoNewController'
        }
      },
      resolve: {
        voyo: ['$state', 'Voyo', 'currentUser', function ($state, Voyo, currentUser) {
          return Voyo.create({
            user: currentUser.$id
          });
        }]
      }
    });
  });
