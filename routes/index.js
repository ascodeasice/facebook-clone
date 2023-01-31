var express = require('express');
var router = express.Router();
const passport = require("passport");

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login/facebook', passport.authenticate('facebook'));

router.get('/oauth2/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login', failureMessage: true }),
  function (req, res) {
    res.redirect('/');
  });

module.exports = router;
