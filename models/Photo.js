const mongoose = require("mongoose");

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const photoSchema = new Schema({
  created_on: {
    type: Date,
    default: Date.now,
  },
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
  dimensions: {
    height: {
      type: Number,
      min: 0,
    },
    width: {
      type: Number,
      min: 0,
    },
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
