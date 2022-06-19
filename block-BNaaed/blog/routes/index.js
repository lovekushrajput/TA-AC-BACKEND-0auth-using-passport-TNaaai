var express = require('express');
var router = express.Router();
let passport = require('passport')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});

router.get('/success', (req, res) => {
  res.send('Gitbub login success')
});

router.get('/failure', (req, res) => {
  res.send('Gitbub login failed')
});

//interacting with github server
router.get('/auth/github', passport.authenticate('github'))

//github server comes back to our application
router.get('/auth/github/callback', passport.authenticate('github', {
  failureRedirect: '/failure'
}), (req, res) => {
  res.redirect('/users/articles')
})

module.exports = router;
