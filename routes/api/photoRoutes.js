const router = require("express").Router();
const Photo = require("../../models/Photo.js");

router.post("/photos/new", async (req, res) => {
  try {
    const { body } = req;
    let result = await Photo.create({ body });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/photos", async (req, res) => {
  try {
    let result = await Photo.find().populate({
      path: "User",
      select: "username",
    });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/photos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let result = await Photo.findById(id)
      .populate({
        path: "user",
        select: "username",
      })
      .populate("comments");
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
