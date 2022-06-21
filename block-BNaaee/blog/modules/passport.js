let passport = require('passport')
let GitHubStrategy = require('passport-github').Strategy
var GoogleStrategy = require('passport-google-oauth2').Strategy
var LocalStrategy = require('passport-local').Strategy

let User = require('../models/User')


// //github
passport.use(new GitHubStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: '/auth/github/callback'
}, (accessToken, refreshToken, profile, done) => {
    //email
    console.log(profile._json.email)

    User.findOne({ email: profile._json.email }, (err, user) => {
        console.log(err, user, 'hii')
        if (err) return done(err)
        //no user
        if (!user) {
            return done(null, false, { message: 'Invalid Email' })
        }
        //success
        return done(null, user)
    })
}))


// //gogle
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
}, (accessToken, refreshToken, profile, done) => {

    User.findOne({ email: profile._json.email }, (err, user) => {
        if (err) return done(err)
        if (!user) {
            User.create(profileData, (err, addedUser) => {
                if (err) return done(err)
                return done(null, addedUser)
            })
        }
        done(null, user)
    })
}))

//password
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, (email, password, done) => {
    //email
    User.findOne({ email: email }, (err, user) => {
        if (err) return done(err)
        //no user
        if (!user) {
            return done(null, false, { message: 'Invalid Email' })
        }

        //password
        user.varifyPassword(password, (err, result) => {
            if (err) return done(err)
            //no password
            if (!result) {
                return done(null, false, { message: 'password is wrong' })
            }
            //success
            return done(null, user)
        })

    })
}))

passport.serializeUser(function (user, done) {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user)
    })
})