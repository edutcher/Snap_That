const path = require("path");
const express = require("express");
const logger = require("morgan");
const session = require("express-session");
const mongoose = require("mongoose");
const routes = require("./routes/htmlRoutes.js");
const passport = require("passport");
require("dotenv").config();

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: "Some Crazy Secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.MONGOD_URI || "mongodb://localhost/snapthat", {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(routes);

//   if (process.env.NODE_ENV === "production") {
//     app.use(express.static("client/build"));
//   }

app.listen(process.env.PORT || 3001, () => console.log("Now listening"));
