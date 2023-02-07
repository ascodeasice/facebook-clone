const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");

const CommentSchema = new Schema(
    {
        author: { type: Schema.Types.ObjectId, ref: "User", required: true },
        text: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

CommentSchema.virtual("relativeCreatedAt").get(function () {
    return DateTime.fromJSDate(new Date(this.createdAt)).toRelative();
});

module.exports = mongoose.model("Comment", CommentSchema);