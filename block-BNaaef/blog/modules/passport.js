let passport = require('passport');
let GitHubStrategy = require('passport-github').Strategy;
let GoogleStrategy = require('passport-google-oauth2').Strategy;
let LocalStrategy = require('passport-local');

let User = require('../models/User')


//login using github
passport.use(new GitHubStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: '/auth/github/callback'
}, (accessToken, refreshToken, profile, done) => {
    User.findOne({ email: profile._json.email }, (err, user) => {
        if (err) return done(err)
        done(null, user)
    })
}))

//login using google
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
    User.findOne({ email: profile._json.email }, (err, user) => {
        if (err) return done(err)
        done(null, user)
    })
}))

//login using password
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',

}, (email, password, done) => {
    User.findOne({ email: email }, (err, user) => {
        if (err) return done(err)
        if (!user) {
            return done(null, false, { massage: 'Invalid Email' })
        }

        // //varify paasword
        user.varifyPassword(password, (err, result) => {
            if (err) return done(err)
            if (!result) {
                return done(null, false, { massage: 'Wrong Paasword' })
            }
            done(null, user)
        })

    })
}))


passport.serializeUser((user, done) => {
    return done(null, user.id)
})

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(null, user)
    })
})
