const Post = require("../models/Post");
const User = require("../models/User");
const async = require("async");
const Comment = require("../models/Comment");
const { body, validationResult } = require("express-validator");

exports.getPostFeed = (req, res, next) => {
    if (!res.locals.currentUser) {
        res.render("index", {
            title: "Facebook Clone",
        });
        return;
    }
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
                    .populate("author")
                    .populate("comments")
                    .populate("peopleLiked")
                    .sort({ createdAt: -1 })
                    .exec(callback)
            },
        },
        (err, results) => {
            if (err) {
                return next(err);
            }

            res.render("index", {
                title: "Facebook Clone",
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
    body("images")
        .custom((value, { req }) => {
            if (req.files && req.files.length > 10) {
                return false;
            }
            return true;
        })
        .withMessage("You can post 10 images at most"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render("createPost", {
                title: "New Post",
                user: res.locals.currentUser,
                errors: errors.array(),
            });
            return;
        }
        const newPost = new Post({
            author: req.body.author,
            peopleLiked: [],
            text: req.body.text,
            comments: [],
            images: !req.files ? [] : req.files.map((file) => file.buffer)
        });
        newPost.save(err => {
            if (err) {
                return next(err);
            }
        });
        res.redirect("/");
    }
]

exports.likePost = (req, res, next) => {
    // make other user like this post
    if (req.params.userId != res.locals.currentUser._id) {
        res.redirect("/");
    }
    Post.findById(req.params.postId)
        .exec((err, post) => {
            if (err) {
                return next(err);
            }
            if (post == null) {
                const error = new Error("Post not found");
                error.status = 404;
                return next(error);
            }
            // if user already liked, remove the user
            if (post.peopleLiked.includes(req.params.userId)) {
                post.peopleLiked.splice(post.peopleLiked.indexOf(req.params.userId), 1);
            }
            // not liked
            else {
                post.peopleLiked.push(req.params.userId);
            }

            post.save(err => {
                if (err) {
                    return next(err);
                }
            })

            res.redirect(`/posts/${req.params.postId}`);
        })
}

exports.deletePost = (req, res, next) => {
    Post.findByIdAndRemove(req.params.postId, (err, post) => {
        if (err) {
            return next(err);
        }

        for (let i = 0; i < post.comments.length; i++) {
            Comment.findByIdAndRemove(post.comments[i]._id, (err, comment) => {
                if (err) {
                    return next(err);
                }
            });
        }
    });
    res.redirect('/');
}

exports.createCommentGet = (req, res, next) => {
    res.render("createComment", {
        title: "Comment",
        user: res.locals.currentUser,
    });
}

exports.createCommentPost = [
    body("author", "Author is required")
        .trim()
        .isLength({ min: 1 }),
    body("text", "Comment text is required")
        .trim()
        .isLength({ min: 1 }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render("createComment", {
                title: "Comment",
                user: res.locals.currentUser,
                errors: errors.array(),
            });
            return;
        }

        const newComment = new Comment({
            text: req.body.text,
            author: res.locals.currentUser._id,
        });

        newComment.save(err => {
            if (err) {
                return next(err);
            }
        });

        Post.findById(req.params.postId)
            .exec((err, post) => {
                if (err) {
                    return next(err);
                }
                post.comments.push(newComment._id);
                post.save(err => {
                    if (err) {
                        return next(err);
                    }
                })
            })
        res.redirect(`/posts/${req.params.postId}`);
    }
]

exports.getPostDetail = (req, res, next) => {
    Post.findById(req.params.postId)
        .populate("author")
        .populate({
            path: 'comments',
            populate: {
                path: 'author',
                model: 'User'
            }
        })
        .exec((err, post) => {
            if (err) {
                return next(err);
            }
            res.render("post", {
                title: "Post",
                post: post,
                user: res.locals.currentUser,
            })
        });
}

exports.deleteComment = (req, res, next) => {
    Comment.findByIdAndRemove(req.params.commentId, (err, comment) => {
        if (err) {
            return next(err);
        }
        res.redirect(`/posts/${req.params.postId}`)
    });
}