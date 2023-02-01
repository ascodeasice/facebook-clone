var express = require('express');
var router = express.Router();
const passport = require("passport");
const User = require('../models/User');
const jwt = require("jsonwebtoken");
const authController = require("../controllers/authController");

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login/facebook', passport.authenticate('facebook'));

router.get('/oauth2/facebook/callback',
  passport.authenticate('facebook', { failureMessage: true }),
  authController.logIn
);

module.exports = router;
