var express = require('express');
var router = express.Router();
var User = require('../models/User')
var Article = require('../models/Article');
var Comment = require('../models/Comment');
const auth = require('../middlewares/auth');
const passport = require('passport');


router.get('/', (req, res) => {
  res.send('respodind with resource')
})

//render a form for registration
router.get('/register', (req, res) => {
  let err = req.flash('error')[0]
  res.render('register', { err })
})

// capture the data
router.post('/register', (req, res, next) => {
  User.create(req.body, (err, user) => {
    if (err) {
      if (err.name === 'MongoServerError') {
        req.flash('error', 'This email is already exist')
        return res.redirect('/users/register')
      }
      if (err.name === 'ValidationError') {
        req.flash('error', err.message)
        return res.redirect('/users/register')
      }
    }
    res.redirect('/users/login')
  })
})


//login form
router.get('/login', (req, res) => {
  let err = req.flash('error')[0]
  res.render('login', { err })
})


// capture the data
router.post('/login', passport.authenticate('local', {
  failureRedirect: '/users/login',
  successRedirect: '/users/articles',
  failureFlash: true
}));


//logout
router.get('/logout', (req, res) => {
  res.clearCookie('connect.sid')
  req.session.destroy()
  res.redirect('/users/login')
});

//list of articles
router.get('/articles', (req, res, next) => {
  Article.find({}, (err, articles) => {
    if (err) return next(err)
    res.render('articlesList', { articles })
  })
})





module.exports = router;
