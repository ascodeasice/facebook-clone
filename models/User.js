const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, required: true },
    bio: { type: String },
    friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
    facebookId: { type: String, required: true },
    profilePictureURL: { type: String },
});

module.exports = mongoose.model("User", UserSchema);