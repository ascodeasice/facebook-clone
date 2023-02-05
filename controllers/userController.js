const User = require("../models/User")

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