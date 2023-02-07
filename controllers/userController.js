const User = require("../models/User");
const async = require("async");
const Post = require("../models/Post");

exports.getUsers = (req, res, next) => {
    const allFriends = res.locals.currentUser.friends;
    // get suggested friends
    User.aggregate([{
        // Doesn't exist friend request sent to this user
        $lookup: {
            from: 'friendrequests',
            let: { userId: '$_id' },
            pipeline: [
                {
                    $match: {
                        $and: [
                            { $expr: { $eq: ['$to', '$$userId'] } },
                            { $expr: { $eq: ['$from', res.locals.currentUser._id] } }
                        ]
                    }
                }
            ],
            as: 'friendRequests'
        }
    },
    {
        $match: {
            friendRequests: { $size: 0 }
        }
    },
    {
        $match: {
            $and: [{ _id: { $nin: allFriends } },
            { _id: { $ne: res.locals.currentUser._id } }
            ]
        }
    }])
        .exec((err, users) => {
            if (err) {
                return next(err);
            }
            res.render("users", {
                title: "Users",
                user: res.locals.currentUser,
                suggestedFriends: users,
            })
        })
}

exports.getUser = (req, res, next) => {
    async.parallel(
        {
            user(callback) {
                User.findById(req.params.userId)
                    .exec(callback);
            },
            posts(callback) {
                Post.find({ author: req.params.userId })
                    .populate("author")
                    .sort({ createdAt: -1 })
                    .exec(callback);
            }
        },
        (err, results) => {
            if (err) {
                return next(err);
            }
            const { user, posts } = results;
            if (user == null) {
                const error = new Error("User not found");
                error.status = 404;
                return next(error);
            }
            res.render("user", {
                title: user.username,
                user: res.locals.currentUser,
                profileUser: user,
                posts: posts,
            })
        }
    );
}