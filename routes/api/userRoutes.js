const router = require("express").Router();
const passport = require("passport");
const User = require("../../models/User.js");

router.post("/new", async (req, res) => {
  try {
    const { username, password, email } = req.body;
    let newUser = new User({ username, email });
    let response = res;
    await User.register(newUser, password, function (err, user) {
      if (err) {
        console.log(err);
      } else {
        passport.authenticate("local")(req, res, function () {
          response.status(200).json(req.user);
        });
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
      let response = res;
      if (err) {
        res.status(400).send("Incorrect login or password");
      } else {
        passport.authenticate("local")(req, res, function () {
          response.status(200).json(req.user);
        });
      }
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/loggedin", async (req, res) => {
  if (req.user) {
    res.status(200).json(req.user);
  } else {
    res.status(400).send("not logged in");
  }
});

module.exports = router;
