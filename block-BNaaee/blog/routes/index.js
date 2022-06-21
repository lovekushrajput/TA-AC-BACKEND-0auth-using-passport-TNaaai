var express = require('express');
var router = express.Router();
let passport = require('passport')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});

router.get('/success', (req, res) => {
  res.redirect('/users/articles')
});

router.get('/failure', (req, res) => {
  res.redirect('/')
});

//interacting with github server
router.get('/auth/github', passport.authenticate('github'))

//github server comes back to our application
router.get('/auth/github/callback', passport.authenticate('github', {
  failureRedirect: '/failure'
}), (req, res) => {
  res.redirect('/success')
})


//interacting with GOOGLE server
router.get('/auth/google', passport.authenticate('google', { scope: ["profile email"] }))

//google server comes back to our application
router.get('/auth/google/callback', passport.authenticate('google', {
  failureRedirect: '/failure'
}), (req, res) => {
  res.redirect('/success')
})
module.exports = router;
