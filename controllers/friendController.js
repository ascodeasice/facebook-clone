const User = require("../models/User");
const async = require("async");
const FriendRequest = require("../models/FriendRequest");

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
            if (results.sender == null || results.receiver == null) {
                const error = new Error("User not found");
                error.status = 404;
                return next(error);
            }
            // If both users are friends, redirect back
            if (results.sender.friends.includes(results.receiver._id)) {
                res.redirect("/");
                return;
            }
            // Add use as friend if receiver is a fake user
            if (results.receiver.facebookId.startsWith("fakeUserId")) {
                results.receiver.friends.push(results.sender._id);
                results.sender.friends.push(results.receiver._id);

                results.receiver.save(err => {
                    if (err) {
                        return next(err);
                    }
                });

                results.sender.save(err => {
                    if (err) {
                        return next(err);
                    }
                })

                res.redirect("/");
                return;
            }
            // send request to real user, wait for response
            const newFriendRequest = new FriendRequest({
                from: results.sender._id,
                to: results.receiver._id,
            });
            console.log(newFriendRequest);
            newFriendRequest.save((err) => {
                if (err) {
                    return next(err);
                }
                res.redirect("/");
            })
        })
}