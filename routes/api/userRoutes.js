const router = require("express").Router();
const passport = require("passport");
const User = require("../../models/User.js");
const Photo = require("../../models/Photo");
const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/AppError");

router.post(
  "/new",
  catchAsync(async (req, res, next) => {
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
  })
);

router.get(
  "/top",
  catchAsync(async (req, res, next) => {
    const topFavs = await User.aggregate([
      {
        $project: { username: 1, _id: 1, total_favorites: 1 },
      },
      { $sort: { total_favorites: -1 } },
      { $limit: 3 },
    ]);
    const mostPhotos = await User.aggregate([
      {
        $project: {
          username: 1,
          _id: 1,
          length: { $size: "$photos" },
        },
      },
      { $sort: { length: -1 } },
      { $limit: 3 },
    ]);
    const mostReqs = await User.aggregate([
      {
        $project: {
          username: 1,
          _id: 1,
          length: { $size: "$requests_filled" },
        },
      },
      { $sort: { length: -1 } },
      { $limit: 3 },
    ]);
    res.status(200).json({ topFavs, mostPhotos, mostReqs });
  })
);

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

router.get(
  "/loggedin",
  catchAsync(async (req, res, next) => {
    if (req.user) {
      res.status(200).json(req.user);
    } else {
      res.status(400).send("not logged in");
    }
  })
);

router.get("/logout", function (req, res, next) {
  req.logout();
  res.redirect("/");
});

router.put(
  "/email/:id",
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { isEmailShown } = req.body;
    const result = await User.findByIdAndUpdate(id, { isEmailShown });

    res.status(200).json(result);
  })
);

router.get(
  "/:id",
  catchAsync(async function (req, res, next) {
    const { id } = req.params;
    let result = await User.findById(id, { salt: 0, hash: 0 })
      .populate("photos")
      .populate({
        path: "requests",
        populate: { path: "photo", select: "_id" },
      })
      .populate({
        path: "favorites",
        populate: { path: "user", select: "username" },
      })
      .populate({
        path: "requests_filled",
        populate: [{ path: "photo" }, { path: "user", select: "username" }],
      });
    res.status(200).json(result);
  })
);

module.exports = router;
