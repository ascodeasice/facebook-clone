const User = require("../models/User");

exports.logIn = (req, res) => {
    console.log("redirecting...")
    res.redirect("/");
}

exports.logOut = (req, res) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
}

exports.guestLogIn = (req, res, next) => {
    res.redirect("/");
}