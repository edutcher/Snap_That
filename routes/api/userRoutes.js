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

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  function (req, res) {
    res.status(200).json(req.user);
  }
);

router.get("/loggedin", async (req, res) => {
  if (req.user) {
    res.status(200).json(req.user);
  } else {
    res.status(400).send("not logged in");
  }
});

router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

router.get("/:id", async function (req, res) {
  try {
    const { id } = req.params;
    let result = await User.findById(id)
      .populate("photos")
      .populate({
        path: "favorites",
        populate: { path: "user", select: "username" },
      });
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
