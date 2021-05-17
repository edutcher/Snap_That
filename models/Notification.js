const mongoose = require("mongoose");

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const notificationSchema = new Schema({
  created_on: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: ObjectId,
    ref: "User",
  },
  photo: {
    type: ObjectId,
    ref: "Photo",
  },
  text: {
    type: String,
    required: "Text Required",
  },
  request: {
    type: ObjectId,
    ref: "Request",
  },
  status: {
    type: String,
  },
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
