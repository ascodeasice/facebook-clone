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