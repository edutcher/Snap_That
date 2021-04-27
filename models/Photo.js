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
  subcategory: {
    type: String,
  },
  tags: {
    type: [String],
  },
  rating_value: {
    type: Number,
    min: 0,
  },
  total_ratings: {
    type: Number,
    min: 0,
  },
  favorites: {
    type: Number,
    min: 0,
  },
  comments: {
    type: [
      {
        type: ObjectId,
        ref: "Comment",
      },
    ],
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
