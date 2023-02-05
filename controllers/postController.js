const Post = require("../models/Post");
const User = require("../models/User");
const async = require("async");
const { body, validationResult } = require("express-validator");

exports.getPostFeed = (req, res, next) => {
    const allFriends = res.locals.currentUser.friends;
    async.parallel(
        {
            suggestedFriends(callback) {
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
                    .limit(10) // suggest maximum 10 friends
                    .exec(callback)
            },
            feedPosts(callback) {
                Post.find({
                    $or: [{ author: { $in: allFriends } },
                    { author: res.locals.currentUser._id }
                    ]
                })
                    .sort({ updatedAt: -1 })
                    .exec(callback)
            }
        },
        (err, results) => {
            if (err) {
                return next(err);
            }

            res.render("index", {
                title: "Home",
                user: res.locals.currentUser,
                posts: results.feedPosts,
                suggestedFriends: results.suggestedFriends,
            });
        }
    )
}

exports.createPostGet = (req, res) => {
    res.render("createPost", {
        title: "New Post",
        user: res.locals.currentUser,
    });
}

exports.createPostPost = [
    body("text", "Text is required")
        .trim()
        .isLength({ min: 1 }),
    body("author", "Author is required")
        .trim()
        .isLength({ min: 1 }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render("createPost", {
                title: "New Post",
                user: res.locals.currentUser,
                errors: errors.array(),
            });
        }
        const newPost = new Post({
            author: req.body.author,
            peopleLiked: [],
            text: req.body.text,
        });
        newPost.save(err => {
            if (err) {
                return next(err);
            }
        });
        res.redirect("/");
    }
]