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
                res.redirect("/users");
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

                res.redirect("/users");
                return;
            }
            // send request to real user, wait for response
            const newFriendRequest = new FriendRequest({
                from: results.sender._id,
                to: results.receiver._id,
            });
            newFriendRequest.save((err) => {
                if (err) {
                    return next(err);
                }
                res.redirect("/users");
            })
        })
}

exports.getFriends = (req, res, next) => {
    async.parallel(
        {
            user(callback) {
                User.findById(req.params.userId)
                    .populate("friends")
                    .exec(callback);
            },
            friendRequests(callback) {
                FriendRequest.find({ to: req.params.userId })
                    .populate("from")
                    .exec(callback);
            }
        },
        (err, results) => {
            if (err) {
                return next(err);
            }
            res.render("friends", {
                title: "Friends",
                user: res.locals.currentUser,
                friends: results.user.friends,
                friendRequests: results.friendRequests,
            })
        });
}

exports.acceptRequest = (req, res, next) => {
    async.parallel(
        {
            accepter(callback) {
                User.findById(req.params.userId)
                    .exec(callback)
            },
            sender(callback) {
                User.findById(req.params.userId2)
                    .exec(callback);
            }
        },
        (err, results) => {
            if (err) {
                return next(err);
            }
            if (results.accepter == null || results.sender == null) {
                const error = new Error("User not found");
                error.status = 404;
                return next(error);
            }
            // already friends
            if (results.accepter.friends.includes(results.sender._id)) {
                const error = new Error("Already friends");
                error.status = 404;
                res.redirect(`/friends/${req.params.userId}`);
                return;
            }
            // make them friends
            results.accepter.friends.push(results.sender._id);
            results.sender.friends.push(results.accepter._id);

            results.accepter.save(err => {
                if (err) {
                    return next(err);
                }
            });

            results.sender.save(err => {
                if (err) {
                    return next(err);
                }
            })

            // delete friend request
            FriendRequest.findOneAndRemove({ from: results.sender._id, to: results.accepter._id }, (err, request) => {
                if (err) {
                    return next(err);
                }
            })

            res.redirect(`/friends/${req.params.userId}`);
        });
}

exports.deleteFriend = (req, res, next) => {
    async.parallel(
        {
            user1(callback) {
                User.findById(req.params.userId)
                    .exec(callback);
            },
            user2(callback) {
                User.findById(req.params.userId2)
                    .exec(callback);
            }
        },
        (err, results) => {
            const { user1, user2 } = results;
            if (err) {
                return next(err);
            }
            if (user1 == null || user2 == null) {
                const error = new Error("User not found");
                error.status = 404;
                return next(error);
            }
            // They aren't friends
            if (!user1.friends.includes(user2._id) && !user2.friends.includes(user1._id)) {
                res.redirect(`/friends/${req.params.userId}`);
                return;
            }

            // remove users from friends
            user1.friends.splice(user1.friends.indexOf(user2._id), 1);
            user2.friends.splice(user2.friends.indexOf(user1._id), 1);

            user1.save(err => {
                if (err) {
                    return next(err);
                }
            });

            user2.save(err => {
                if (err) {
                    return next(err);
                }
            });

            res.redirect(`/friends/${req.params.userId}`);
        }
    )
}