const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Comment = new Schema(
    {
        author: { type: Schema.Types.ObjectId, required: true },
        post: { type: Schema.Types.ObjectId, required: true },
        text: { type: Schema.Types.ObjectId, required: true },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Comment", Comment);