angular.module('Voyo.services').service( 'UserService', function (User, Profile) {

  return {
    createUser(uid, properties) {
      let props = angular.extend({}, properties)
      return User.create(uid, props);
    },
    createProfile(uid, properties) {
      return Profile.create(uid, properties);
    },
    createSocialProfile(uid, profile) {
      return new Promise( (resolve, reject) => {
        let fbRef = new Firebase(`https://voyo.firebaseio.com/facebookUsers/${uid}`)

        return fbRef.set(profile, function () {
          resolve(profile);
        });
      });
    },
    create(uid, user) {
      return this.createUser(uid, {
        email: user.email
      }).then( (data) => {
        return this.createProfile(uid, {
        });
      });
    },
    createFromFacebook(uid, user) {
      return this.createUser(uid, {
        facebookUserId: user.facebook.id,
        email: user.facebook.email,
        firstName: user.facebook.cachedUserProfile.first_name,
        lastName: user.facebook.cachedUserProfile.last_name,
        profileImageUrl: user.facebook.profileImageURL
      }).then( (data) => {
        return this.createProfile(uid, {
          firstName: user.facebook.cachedUserProfile.first_name,
          lastName: user.facebook.cachedUserProfile.last_name,
          profileImageUrl: user.facebook.profileImageURL
        });
      }).then( (data) => {
        return this.createSocialProfile(uid, user.facebook);
      });

    }
  };
});
