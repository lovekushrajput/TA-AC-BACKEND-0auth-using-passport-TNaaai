let User = require('../models/User')

module.exports = {

    loggedInUser: (req, res, next) => {
        if (req.session && req.session.passport) {
            next()
        } else {
            res.redirect('/users/login')
        }
    },

    userInfo: (req, res, next) => {
        let userId = req.session && req.session.passport
        if (userId) {
            User.findById(req.session.passport.user, "username name email photo", (err, user) => {
                if (err) return next(err);

                req.user = user;
                res.locals.user = user;
                next()
            })
        } else {
            req.user = null;
            res.locals.user = null;
            next()
        }
    }
}