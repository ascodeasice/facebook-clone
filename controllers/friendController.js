const User = require("../models/User");
const async = require("async");

exports.sendFriendRequest = (req, res, next) => {
    async.parallel(
        {
            sender(callback) {
                User.findById(req.params.userId1)
                    .exec(callback);
            },
            receiver(callback) {
                User.findById(req.params.userId2)
                    .exec(callback);
            }
        },
        (err, results) => {
            if (err) {
                return next(err);
            }
            if (sender == null || receiver == null) {
                const error = new Error("User not found");
                error.status = 404;
                return next(error);
            }
            // If both users are friends, redirect back
            // Add use as friend if receiver is a fake user
            if (results.receiver.facebookId.startsWith("fakeUserId")) {
                results.receiver.friends.push()
            }

        })
}