const mongoose = require("mongoose");

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const photoSchema = new Schema({
  image_url: {
    type: String,
    required: "URL Required",
  },
  title: {
    type: String,
    required: "Title Required",
  },
  category: {
    type: String,
    required: "Category Required",
  },
  tags: {
    type: [String],
  },
  favorites: {
    type: Number,
    min: 0,
  },
  user: {
    type: ObjectId,
    ref: "User",
  },
  request: {
    type: ObjectId,
    ref: "Request",
  },
});

const Photo = mongoose.model("Photo", photoSchema);

module.exports = Photo;
