var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require("express-session");
const cors = require("cors");
require("dotenv").config();

var indexRouter = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors()); // enable all cors request

// Set up mongoose connection
const mongoose = require("mongoose");
mongoose.set('strictQuery', false);
const mongoDB = process.env.MONGO_URL;

main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

// SECTION configures facebook strategy
var passport = require('passport');
var FacebookStrategy = require('passport-facebook');
const User = require("./models/User");

passport.use(new FacebookStrategy({
  clientID: process.env['FACEBOOK_APP_ID'],
  clientSecret: process.env['FACEBOOK_APP_SECRET'],
  callbackURL: process.env['FACEBOOK_CALLBACK_URL'],
  profileFields: ['displayName', 'photos']
},
  function (accessToken, refreshToken, profile, cb) {
    User.findOne({ facebookId: profile.id })
      .exec((err, user) => {
        if (err) {
          return cb(err);
        }
        if (user == null) {
          // create a user
          const newUser = new User({
            username: profile.displayName,
            facebookId: profile.id,
            friends: [],
            bio: "",
            profilePictureURL: profile.photos ? profile.photos[0].value : "",
          });

          newUser.save((err) => {
            if (err) {
              return cb(err);
            }
          });
          return cb(null, newUser);
        }
        // user exists
        return cb(null, user);
      })
  }
));

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
