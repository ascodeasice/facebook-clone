const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.getUser = (req, res, next) => {
    // verify token
    jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
        if (err) {
            res.sendStatus(403);
            return next();
        }
    });

    User.findById(req.params.userId)
        .exec((err, user) => {
            if (err) {
                return next(err);
            }
            if (user == null) {
                const error = new Error("User not found");
                error.status(404);
                return next(error);
            }

            res.json(user);
        });
}