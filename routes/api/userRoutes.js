const router = require("express").Router();
const passport = require("passport");
const User = require("../../models/User.js");

router.post("/new", async (req, res) => {
  try {
    const { username, password, email } = req.body;
    let newUser = new User({ username, email });
    await User.register(newUser, password, function (err, user) {
      if (err) {
        console.log(err);
      } else {
        console.log(user);
        passport.authenticate("local")(req, res, function () {});
        res.redirect("/");
      }
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = req.body;
    let newUser = new User(user);

    req.login(newUser, function (err) {
      if (err) {
        res.status(400).send("Incorrect login or password");
      } else {
        passport.authenticate("local")(req, res, function () {});
        res.status(200).send("success");
      }
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
