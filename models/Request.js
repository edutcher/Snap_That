const mongoose = require("mongoose");

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const requestSchema = new Schema({
  user: {
    type: {
      type: ObjectId,
      ref: "User",
    },
  },
  text: {
    type: String,
    required: "Text Required",
  },
  status: {
    type: String,
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
