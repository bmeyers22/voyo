angular.module('Voyo.services').service( 'Auth', function (FIREBASE_URL, $firebaseAuth, $firebaseArray, $firebaseObject, $state, UserService) {
  let ref = new Firebase(FIREBASE_URL)

  return {
    auth: $firebaseAuth(ref),
    user: null,

    login(user) {
      return this.auth.$authWithPassword({
        email: user.email,
        password: user.password
      });
    },
    socialCallback(authData) {
      let fbQueryRef = new Firebase("https://voyo.firebaseio.com/facebookUsers");
      return fbQueryRef.orderByChild("id").equalTo(authData.facebook.id).once('value', (snapshot) => {
        if (snapshot.numChildren() === 0) {
          return UserService.createFromFacebook(authData.uid, authData);
        } else {
          return true;
        }
      });
    },
    socialLogin(provider) {
      return this.auth.$authWithOAuthRedirect(provider, {
        scope: 'user_birthday, user_location, user_about_me, email, public_profile'
      }).then( (authData) => {
        return this.socialCallback(authData);
      })
      .catch( (error) => {
        if (error.code === 'TRANSPORT_UNAVAILABLE') {
          return this.auth.$authWithOAuthPopup(provider, {
            scope: 'user_birthday, user_location, user_about_me, email, public_profile'
          }).then( (authData) => {
            return this.socialCallback(authData);
          });
        } else {
          console.log(error);
        }
      });
    },

    register(user) {
      return this.auth.$createUser({
        email: user.email,
        password: user.password
      }).then( () => {
        //  authenticate so we have permission to write to Firebase
        return this.login(user);
      }).then( (data) => {
        //  store user data in Firebase after creating account
        // console.log('datos del usuario:' + JSON.stringify(data))
        return UserService.create(data.uid, user);
      }).catch( (error) => {
        console.log(error);
      });
    },

    logout() {
      return this.auth.$unauth()
    },

    resetpassword(user) {
      return this.auth.$resetPassword({
        email: user.email
      }).then( function() {
        console.log('Password reset email sent successfully!')
      }).catch( function (error) {
        console.error('Error: ', error.message)
      });
    },

    changePassword(user) {
      return this.auth.$changePassword({
        email: user.email,
        oldPassword: user.oldPass,
        newPassword: user.newPass
      });
    },

    signedIn() {
      return !!this.user;
    }
  }
});
