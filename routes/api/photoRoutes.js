const router = require("express").Router();
const Photo = require("../../models/Photo.js");
const User = require("../../models/User");
const Notification = require("../../models/Notification");
const catchAsync = require("../../utils/catchAsync");
const { cloudinary } = require("../../utils/cloudinary");

router.post(
  "/new",
  catchAsync(async (req, res, next) => {
    const { details, username, photo } = req.body;
    let photoResult = await cloudinary.uploader.upload(
      photo,
      {
        public_id: `${username}/${details.title}`,
        overwrite: true,
        invalidate: true,
      },
      function (result) {
        console.log(result);
      }
    );

    let result = await Photo.create({
      ...details,
      image_url: photoResult.url,
    });

    let curUser = await User.findById(req.user._id);
    curUser.photos.push(result._id);
    curUser.save();
    res.status(200).json(result);
  })
);

router.post(
  "/avatar",
  catchAsync(async (req, res, next) => {
    const { username, photo } = req.body;
    let photoResult = await cloudinary.uploader.upload(
      photo,
      {
        public_id: `${username}/Avatar`,
        overwrite: true,
        invalidate: true,
      },
      function (result) {
        console.log(result);
      }
    );

    await User.findByIdAndUpdate(req.user._id, {
      avatar_url: photoResult.url,
    });

    let result = {
      image_url: photoResult.url,
    };
    res.status(200).json(result);
  })
);

router.post(
  "/search",
  catchAsync(async (req, res, next) => {
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
  })
);

router.get(
  "/",
  catchAsync(async (req, res, next) => {
    let result = await Photo.find({ isDeleted: false }).populate({
      path: "user",
      select: ["username", "_id"],
    });
    res.status(200).json(result);
  })
);

router.get(
  "/random",
  catchAsync(async (req, res, next) => {
    let result = await Photo.find({ isDeleted: false }).populate({
      path: "user",
      select: ["username", "_id"],
    });
    const rand = Math.floor(Math.random() * result.length);

    res.status(200).json(result[rand]);
  })
);

router.get(
  "/category/:category",
  catchAsync(async (req, res, next) => {
    const { category } = req.params;
    let result = await Photo.find({ category, isDeleted: false }).populate({
      path: "user",
      select: ["username", "_id"],
    });
    res.status(200).json(result);
  })
);

router.post(
  "/favorite",
  catchAsync(async (req, res, next) => {
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
  })
);

router.get(
  "/top",
  catchAsync(async (req, res, next) => {
    const topFavs = await Photo.aggregate([
      {
        $project: { image_url: 1, _id: 1, title: 1, favorites: 1, user: 1 },
      },
      { $sort: { favorites: -1 } },
      { $limit: 3 },
    ]);
    const result = await Photo.populate(topFavs, {
      path: "user",
      select: ["username", "_id"],
    });
    res.status(200).json(result);
  })
);

router.delete(
  "/:id",
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const result = await Photo.findByIdAndUpdate(id, { isDeleted: true });
    const photoUser = await User.findById(result.user);
    photoUser.photos.pull(result._id);
    photoUser.save();
    res.status(200).json(result);
  })
);

router.put(
  "/:id",
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { body } = req;
    const result = await Photo.findByIdAndUpdate(id, body);
    res.status(200).json(result);
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const result = await Photo.findById(id)
      .populate({
        path: "user",
        select: ["username", "_id"],
      })
      .populate({
        path: "request",
        populate: { path: "user", select: "username" },
      });
    res.status(200).json(result);
  })
);

module.exports = router;
