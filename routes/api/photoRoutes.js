const router = require("express").Router();
const Photo = require("../../models/Photo.js");
const User = require("../../models/User");
const { cloudinary } = require("../../utils/cloudinary");

router.post("/new", async (req, res) => {
  try {
    const photoDetails = req.body.details;
    const photo = req.body.photo;
    let photoResult = await cloudinary.uploader.upload(
      photo,
      {
        overwrite: true,
        invalidate: true,
      },
      function (result) {
        console.log(result);
      }
    );

    let result = await Photo.create({
      ...photoDetails,
      image_url: photoResult.url,
    });

    let curUser = await User.findById(req.user._id);
    curUser.photos.push(result._id);
    curUser.save();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/search", async (req, res) => {
  try {
    const { query } = req.body;
    const titleResults = await Photo.find({
      title: { $regex: new RegExp(query, "i") },
    }).populate({
      path: "user",
      select: "username",
    });
    const tagResults = await Photo.find({
      tags: { $regex: new RegExp(query, "i") },
    }).populate({
      path: "user",
      select: "username",
    });
    const results = { titles: titleResults, tags: tagResults };
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/", async (req, res) => {
  try {
    let result = await Photo.find().populate({
      path: "user",
      select: "username",
    });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let result = await Photo.findById(id).populate({
      path: "user",
      select: "username",
    });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
