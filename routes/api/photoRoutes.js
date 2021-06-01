const router = require("express").Router();
const Photo = require("../../models/Photo.js");
const User = require("../../models/User");
const Notification = require("../../models/Notification");
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
      isDeleted: false,
    }).populate({
      path: "user",
      select: "username",
    });
    const tagResults = await Photo.find({
      tags: { $regex: new RegExp(query, "i") },
      isDeleted: false,
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
    let result = await Photo.find({ isDeleted: false }).populate({
      path: "user",
      select: ["username", "_id"],
    });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/random", async (req, res) => {
  try {
    let result = await Photo.find({ isDeleted: false }).populate({
      path: "user",
      select: ["username", "_id"],
    });
    const rand = Math.floor(Math.random() * result.length);

    res.status(200).json(result[rand]);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/category/:category", async (req, res) => {
  try {
    const { category } = req.params;
    let result = await Photo.find({ category, isDeleted: false }).populate({
      path: "user",
      select: ["username", "_id"],
    });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/favorite", async (req, res) => {
  try {
    const { photoId, userId } = req.body;

    if (!photoId || !userId) {
      res.status(400).send("Photo ID and User ID required");
      return;
    }

    const photoResult = await Photo.findById(photoId).populate({
      path: "user",
      select: "_id",
    });

    if (!photoResult) {
      res.status(400).send("Photo not found");
      return;
    }

    const userResult = await User.findById(userId);

    if (!userResult) {
      res.status(400).send("User not found");
      return;
    }

    if (userResult.favorites.includes(photoResult._id)) {
      res.status(400).send("already Favorite");
      return;
    }

    let favorites = 0;
    let currFavs = parseInt(photoResult.favorites);
    if (currFavs > 0) {
      favorites = currFavs + 1;
    } else {
      favorites = 1;
    }
    const updatePhotoResult = await Photo.findByIdAndUpdate(photoId, {
      favorites,
    });

    if (userResult.favorites) userResult.favorites.push(photoResult._id);
    else userResult.favorites = [photoResult._id];
    await userResult.save();

    const newNote = new Notification({
      user: photoResult.user._id,
      text: `Your photo "${photoResult.title}" got a new favorite!.`,
      status: "unread",
    });
    await newNote.save();

    const photoUser = await User.findById(photoResult.user._id);
    photoUser.notifications.push(newNote._id);
    if (photoUser.total_favorites) photoUser.total_favorites++;
    else photoUser.total_favorites = 1;
    await photoUser.save();

    res.status(200).json(updatePhotoResult);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let result = await Photo.findByIdAndUpdate(id, { isDeleted: true });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;
    let result = await Photo.findByIdAndUpdate(id, body);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let result = await Photo.findById(id)
      .populate({
        path: "user",
        select: ["username", "_id"],
      })
      .populate({
        path: "request",
        populate: { path: "user", select: "username" },
      });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
