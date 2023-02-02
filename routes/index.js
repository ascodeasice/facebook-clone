var express = require('express');
var router = express.Router();
const passport = require("passport");
const authController = require("../controllers/authController");

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express',
    user: res.locals.currentUser,
  });
});

router.get('/login/facebook', passport.authenticate('facebook'));

// log in callback
router.get('/oauth2/facebook/callback',
  passport.authenticate('facebook',
    { failureMessage: true, failureRedirect: "/login/facebook" }),
  authController.logIn
);

router.post('/logout/facebook', authController.logOut);

module.exports = router;
