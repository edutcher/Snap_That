const router = require("express").Router();
const User = require("../../models/User.js");

router.post("/user/new", async (req, res) => {
  try {
    const { body } = req;
    let result = await User.create({ body });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
