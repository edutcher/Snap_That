const mongoose = require("mongoose");

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const commentSchema = new Schema({
  user: {
    type: {
      type: ObjectId,
      ref: "User",
    },
  },
  photo: {
    type: {
      type: ObjectId,
      ref: "Photo",
    },
  },
  text: {
    type: String,
    required: "Text Required",
  },
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
