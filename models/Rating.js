const mongoose = require("mongoose");

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const ratingSchema = new Schema({
  user: {
    type: ObjectId,
    ref: "User",
    required: "User Required",
  },
  photo: {
    type: ObjectId,
    ref: "Photo",
    required: "Photo Required",
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
  },
});

const Rating = mongoose.model("Rating", ratingSchema);

module.exports = Rating;
