const path = require("path");
const express = require("express");
const logger = require("morgan");
const session = require("express-session");
const mongoose = require("mongoose");
const routes = require("./routes/");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const MongoStore = require("connect-mongo");
const User = require("./models/User");
require("dotenv").config();

const app = express();

mongoose.connect(process.env.MONGOD_URI || "mongodb://localhost/snapthat", {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(logger("dev"));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json({ limit: "50mb" }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGOD_URI || "mongodb://localhost/snapthat",
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(routes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

app.listen(process.env.PORT || 3001, () => console.log("Now listening"));
