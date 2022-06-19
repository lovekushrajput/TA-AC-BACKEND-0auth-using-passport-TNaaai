let passport = require('passport')
let GitHubStrategy = require('passport-github').Strategy
let User = require('../models/User')

passport.use(new GitHubStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: '/auth/github/callback'
}, (accessToken, refreshToken, profile, done) => {
    let profileData = {
        username: profile.username,
        name: profile._json.name,
        email: profile._json.email,
        photo: profile._json.avatar_url
    }

    User.findOne({ email: profile._json.email }, (err, user) => {
        if (err) return done(err)
        if (!user) {
            User.create(profileData, (err, addedUser) => {
                if (err) return done(err)
                return done(null, addedUser)
                // res.redirect('/users/articles')
            })
        }
        done(null, user)
    })
}))

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user)
    })
})