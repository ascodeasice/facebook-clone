const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");

const PostSchema = new Schema({
    text: { type: String, required: true },
    peopleLiked: [{ type: Schema.Types.ObjectId, ref: "User" }],
    author: { type: Schema.Types.ObjectId, ref: "User" },
},
    {
        timestamps: true,
    });

PostSchema.virtual("relativeCreatedAt").get(function () {
    return DateTime.fromJSDate(new Date(this.createdAt)).toRelative();
});

module.exports = mongoose.model("Post", PostSchema);