angular.module('Voyo')
  .config( function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app.voyo.new.index', {
      url: '',
      views: {
        'app-voyo-new-container': {
          controller: 'VoyoNewIndexController',
          templateUrl: 'voyo/new/index/template.html',
        }
      },
      resolve: {
        cards: ['$state', 'Card', 'voyo', function ($state, Card, voyo) {
          let proms = [];
          for( let i=0; i < 4; i++) {
            proms.push(Card.create({
              voyo: voyo.$id,
              gridPosition: i
            }));
          }
          return Promise.all(proms).then((cards) => {
            cards.forEach((card) => {
              voyo.cards[card.$id] = true
            });
            voyo.save();
            return cards;
          });
        }]
      }

    });
  });
