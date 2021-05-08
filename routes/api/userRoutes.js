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

// router.post("/login", async (req, res) => {
//   try {
//     const userInfo = req.body;
//     console.log(user);
//     let newUser = new User(user);

//     let result = await passport.authenticate()(
//       newUser.username,
//       userInfo.password
//     );
//     console.log(result);
//     req.login(newUser, function (err) {
//       let response = res;
//       if (err) {
//         console.log(err);
//         res.status(400).send("Incorrect login or password");
//       } else {
//         console.log("checking");
//         passport.authenticate("local")(req, res, function () {
//           response.status(200).json(req.user);
//         });
//       }
//     });
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

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

module.exports = router;
