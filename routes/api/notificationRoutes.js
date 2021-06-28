const router = require("express").Router();
const User = require("../../models/User");
const Notification = require("../../models/Notification");
const catchAsync = require("../../utils/catchAsync");

router.get(
  "/user/:id",
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const result = await User.findById(id).populate("notifications");
    res.status(200).json(result);
  })
);

router.post(
  "/read",
  catchAsync(async (req, res, next) => {
    const { notifications } = req.body;
    let result;
    for (let note of notifications) {
      result = await Notification.findByIdAndUpdate(note._id, {
        status: "read",
      });
    }
    res.status(200).json(result);
  })
);

module.exports = router;
