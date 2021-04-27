const mongoose = require("mongoose");

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const commentSchema = new Schema({
  user: {
    type: {
      type: ObjectId,
      ref: "User",
    },
    required: "User Required",
  },
  photo: {
    type: {
      type: ObjectId,
      ref: "Photo",
    },
    required: "Photo required",
  },
  text: {
    type: String,
    required: "Text Required",
  },
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
