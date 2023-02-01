const jwt = require("jsonwebtoken");

exports.logIn = (req, res) => {
    // valid log in
    jwt.sign({}, process.env.JWT_SECRET, (err, token) => {
        res.json({
            user: req.user,
            token: token
        });
    });
}