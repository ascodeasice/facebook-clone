var express = require('express');
var router = express.Router();
const passport = require("passport");
const authController = require("../controllers/authController");
const postController = require("../controllers/postController");
const friendController = require("../controllers/friendController");

/* GET home page. */
router.get('/', postController.getPostFeed);

router.get('/login/facebook', passport.authenticate('facebook'));

// log in callback
router.get('/oauth2/facebook/callback',
  passport.authenticate('facebook',
    { failureMessage: true, failureRedirect: "/", successRedirect: "/" }),
  authController.logIn
);

router.post('/logout/facebook', authController.logOut);

router.get("/users/:userId", (req, res) => res.send("NOT implemented: " + req.params.userId))

router.post("/friendRequest/:userId1/:userId2", friendController.sendFriendRequest)

router.get("/posts/create", postController.createPostGet)

router.post("/posts/create", postController.createPostPost)

module.exports = router;
