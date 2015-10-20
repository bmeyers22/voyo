angular.module('Voyo').factory 'Auth',
  (
    FURL
    $firebaseAuth
    $firebaseArray
    $firebaseObject
    $state
  ) ->
    ref = new Firebase(FURL)

    auth: $firebaseAuth(ref)
    user: null

    createProfile: (uid, user) ->
      profile = {}
      profile[uid] =
        id: uid
        email: user.email
        registeredAt: new Date()

      usersRef = new Firebase("https://voyo.firebaseio.com/users/#{uid}")
      return usersRef.set profile

    createSocialProfile: (uid, user) ->
      usersRef = new Firebase("https://voyo.firebaseio.com/users/#{uid}")
      fbRef = new Firebase("https://voyo.firebaseio.com/facebookUsers/#{uid}")
      profile =
        id: uid
        facebookUserId: user.facebook.id
        email: user.facebook.email
        firstName: user.facebook.cachedUserProfile.first_name
        lastName: user.facebook.cachedUserProfile.last_name
        registeredAt: new Date()
        profileImageUrl: user.facebook.profileImageURL

      facebookProfile = user.facebook

      usersRef.set profile, (ref) ->
        fbRef.set facebookProfile


    login: (user) ->
      @auth.$authWithPassword
        email: user.email
        password: user.password

    socialLogin: (provider) ->
      @auth.$authWithOAuthPopup(provider, {
        scope: 'user_birthday, user_location, user_about_me, email, public_profile'
      }).then (authData) =>
        fbQueryRef = new Firebase("https://voyo.firebaseio.com/facebookUsers")
        fbQueryRef.orderByChild("id").equalTo(authData.facebook.id).once 'value', (snapshot) =>
          unless snapshot.numChildren() > 0
            @createSocialProfile authData.uid, authData
          else
            $state.go 'tab.dash'

    register: (user) ->
      @auth.$createUser
        email: user.email
        password: user.password
      .then () =>
        #  authenticate so we have permission to write to Firebase
        @login user
      .then (data) =>
        #  store user data in Firebase after creating account
        # console.log('datos del usuario:' + JSON.stringify(data))
        @createProfile data.uid, user

    logout: () ->
      @auth.$unauth()

    resetpassword: (user) ->
      @auth.$resetPassword({
        email: user.email
      }).then( () ->
        console.log('Password reset email sent successfully!')
      ).catch( (error) ->
        console.error('Error: ', error.message)
      )

    changePassword: (user) ->
      @auth.$changePassword
        email: user.email
        oldPassword: user.oldPass
        newPassword: user.newPass

    signedIn: ->
      !!@user?.provider
