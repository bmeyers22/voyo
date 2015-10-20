angular.module('Voyo.services').service( 'UserService', function (User) {
  this.createProfile = function(uid, user) {
    let profile = {
      id: uid,
      email: user.email,
      registeredAt: new Date()
    };

    let usersRef = User(uid);
    return usersRef.set(profile);
  };
});
