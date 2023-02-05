const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    text: { type: String, required: true },
    peopleLiked: [{ type: Schema.Types.ObjectId, ref: "User" }],
    author: { type: Schema.Types.ObjectId, ref: "User" },
},
    {
        timestamps: true,
    });

module.exports = mongoose.model("Post", PostSchema);