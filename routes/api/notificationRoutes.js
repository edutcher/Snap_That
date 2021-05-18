const router = require("express").Router();
const User = require("../../models/User");
const Notification = require("../../models/Notification");

router.get("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await User.findById(id).populate("notifications");
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/read", async (req, res) => {
  try {
    const { notifications } = req.body;
    console.log(notifications);
    let result;
    for (let note of notifications) {
      result = await Notification.findByIdAndUpdate(note._id, {
        status: "read",
      });
    }
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
