angular.module('Voyo').factory( 'Auth', function (FIREBASE_URL, $firebaseAuth, $firebaseArray, $firebaseObject, $state, UserService) {
  let ref = new Firebase(FIREBASE_URL)

  return {
    auth: $firebaseAuth(ref),
    user: null,

    createSocialProfile: function (uid, user) {
      let usersRef = new Firebase(`https://voyo.firebaseio.com/users/${uid}`),
        fbRef = new Firebase(`https://voyo.firebaseio.com/facebookUsers/${uid}`),
        profile = {
          id: uid,
          facebookUserId: user.facebook.id,
          email: user.facebook.email,
          firstName: user.facebook.cachedUserProfile.first_name,
          lastName: user.facebook.cachedUserProfile.last_name,
          registeredAt: new Date(),
          profileImageUrl: user.facebook.profileImageURL
        },
        facebookProfile = user.facebook;

      return usersRef.set(profile, function (ref) {
        fbRef.set(facebookProfile);
      });
    },


    login: function(user) {
      return this.auth.$authWithPassword({
        email: user.email,
        password: user.password
      });
    },

    socialLogin: function(provider) {
      return this.auth.$authWithOAuthPopup(provider, {
        scope: 'user_birthday, user_location, user_about_me, email, public_profile'
      }).then( (authData) => {
        let fbQueryRef = new Firebase("https://voyo.firebaseio.com/facebookUsers");
        return fbQueryRef.orderByChild("id").equalTo(authData.facebook.id).once('value', (snapshot) => {
          if (snapshot.numChildren() === 0) {
            this.createSocialProfile(authData.uid, authData);
          } else {
            $state.go('app.dash');
          }
        });
      });
    },

    register: function (user) {
      return this.auth.$createUser({
        email: user.email,
        password: user.password
      }).then( () => {
        //  authenticate so we have permission to write to Firebase
        return this.login(user);
      }).then( (data) => {
        //  store user data in Firebase after creating account
        // console.log('datos del usuario:' + JSON.stringify(data))
        return UserService.createProfile(data.uid, user);
      }).catch( (error) => {
        console.log(error);
      });
    },

    logout: function() {
      return this.auth.$unauth()
    },

    resetpassword: function(user) {
      return this.auth.$resetPassword({
        email: user.email
      }).then( function() {
        console.log('Password reset email sent successfully!')
      }).catch( function (error) {
        console.error('Error: ', error.message)
      });
    },

    changePassword: function(user) {
      return this.auth.$changePassword({
        email: user.email,
        oldPassword: user.oldPass,
        newPassword: user.newPass
      });
    },

    signedIn: function () {
      return !!this.user;
    }
  }
});
