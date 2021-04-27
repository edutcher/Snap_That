const mongoose = require("mongoose");

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const requestSchema = new Schema({
  user: {
    type: {
      type: ObjectId,
      ref: "User",
    },
    required: "User Required",
  },
  text: {
    type: String,
    required: "Text Required",
  },
  isComplete: {
    type: Boolean,
    default: false,
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
  photo: {
    type: ObjectId,
    ref: "Photo",
  },
  filled_by: {
    type: ObjectId,
    ref: "User",
  },
});

const Request = mongoose.model("Request", requestSchema);

module.exports = Request;
