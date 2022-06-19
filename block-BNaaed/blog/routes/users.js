var express = require('express');
var router = express.Router();
var User = require('../models/User')
var Article = require('../models/Article');
var Comment = require('../models/Comment');
const auth = require('../middlewares/auth');


router.get('/', (req, res) => {
  res.send('respodind with resource')
})

//logout
router.get('/logout', (req, res) => {
  res.clearCookie('connect.sid')
  req.session.destroy()
  res.redirect('/')
});

//list of articles
router.get('/articles', (req, res, next) => {
  Article.find({}, (err, articles) => {
    if (err) return next(err)
    res.render('articlesList', { articles })
  })
})





module.exports = router;
