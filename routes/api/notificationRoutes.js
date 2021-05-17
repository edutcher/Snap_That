const router = require("express").Router();
const User = require("../../models/User");

router.get("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await User.findById(id).populate("notifications");
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
