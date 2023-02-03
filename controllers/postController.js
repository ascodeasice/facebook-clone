const Post = require("../models/Post");
const User = require("../models/User");
const downloadImage = require("../functions/downloadImage");

exports.getPostFeed = (req, res, next) => {
    res.render("index", {
        title: "Home",
        user: res.locals.currentUser,
    });
}