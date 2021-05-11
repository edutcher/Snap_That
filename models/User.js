const mongoose = require("mongoose");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
require("mongoose-type-email");
mongoose.SchemaTypes.Email.defaults.message = "Email address is invalid";

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: "Username Required",
  },
  email: {
    type: mongoose.SchemaTypes.Email,
    unique: true,
    required: "Email Required",
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  total_favorites: {
    type: Number,
  },
  photos: {
    type: [
      {
        type: ObjectId,
        ref: "Photo",
      },
    ],
  },
  favorites: {
    type: [
      {
        type: ObjectId,
        ref: "Photo",
      },
    ],
  },
  requests: {
    type: [
      {
        type: ObjectId,
        ref: "Request",
      },
    ],
  },
  requests_filled: {
    type: [
      {
        type: ObjectId,
        ref: "Request",
      },
    ],
  },
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

module.exports = User;
