const Post = require("../models/Post");
const User = require("../models/User");
const async = require("async");

exports.getPostFeed = (req, res, next) => {
    const allFriends = res.locals.currentUser.friends;
    async.parallel(
        {
            suggestedFriends(callback) {
                User.find({ _id: { $nin: allFriends } })
                    .limit(10) // suggest maximum 10 friends
                    .exec(callback)
            },
            feedPosts(callback) {
                Post.find({ author: { $in: allFriends } })
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
                posts: results.posts,
                suggestedFriends: results.suggestedFriends,
            });

        }
    )
}