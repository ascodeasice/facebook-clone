exports.logIn = (req, res) => {
    res.redirect("/")
}

exports.logOut = (req, res) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
}