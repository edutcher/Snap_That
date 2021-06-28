const router = require("express").Router();
const Request = require("../../models/Request.js");
const User = require("../../models/User.js");
const Notification = require("../../models/Notification.js");
const catchAsync = require("../../utils/catchAsync");

router.post(
  "/new",
  catchAsync(async (req, res, next) => {
    const { body } = req;
    const newRequest = {
      ...body,
      status: "pending",
    };
    let result = await Request.create(newRequest);
    let curUser = await User.findById(req.user._id);
    curUser.requests.push(result._id);
    await curUser.save();
    res.status(200).json(result);
  })
);

router.post(
  "/approve",
  catchAsync(async (req, res, next) => {
    if (req.user.isAdmin) {
      const { id } = req.body;
      let result = await Request.findByIdAndUpdate(id, {
        status: "active",
      }).populate({
        path: "user",
        select: "_id",
      });
      const newNote = new Notification({
        user: result.user._id,
        text: `Your request "${result.text}" was approved.`,
        status: "unread",
        request: id,
      });

      await newNote.save();
      const reqUser = await User.findById(result.user._id);
      reqUser.notifications.push(newNote._id);
      await reqUser.save();
      res.status(200).json(result);
    } else {
      res.status(400).send("Unauthorized");
    }
  })
);

router.post(
  "/fill",
  catchAsync(async (req, res, next) => {
    const { id, photo, userId } = req.body;
    let result = await Request.findByIdAndUpdate(id, {
      status: "filled",
      photo,
      filled_by: userId,
    }).populate({
      path: "user",
      select: "_id",
    });
    const newNote = new Notification({
      user: result.user._id,
      text: `Your request "${result.text}" was filled.`,
      status: "unread",
      request: id,
    });
    await newNote.save();
    const reqUser = await User.findById(result.user._id);
    reqUser.notifications.push(newNote._id);
    await reqUser.save();
    const filledUser = await User.findById(userId);
    filledUser.requests_filled.push(id);
    await filledUser.save();
    res.status(200).json(result);
  })
);

router.delete(
  "/:id",
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    let result = await Request.findByIdAndUpdate(id, {
      status: "deleted",
    }).populate({
      path: "user",
      select: "_id",
    });
    res.status(200).json(result);
  })
);

router.post(
  "/deny",
  catchAsync(async (req, res, next) => {
    const { id } = req.body;
    const result = await Request.findByIdAndUpdate(id, {
      status: "denied",
    }).populate({
      path: "user",
      select: "_id",
    });
    const newNote = new Notification({
      user: result.user._id,
      text: `Your request "${result.text}" was denied.`,
      status: "unread",
      request: id,
    });
    await newNote.save();
    const reqUser = await User.findById(result.user._id);
    reqUser.notifications.push(newNote._id);
    await reqUser.save();
    res.status(200).json(result);
  })
);

router.get(
  "/pending",
  catchAsync(async (req, res, next) => {
    if (req.user.isAdmin) {
      let result = await Request.find({ status: "pending" }).populate({
        path: "user",
        select: "username",
      });
      res.status(200).json(result);
    } else {
      res.status(400).send("Unauthorized");
    }
  })
);

router.get(
  "/active",
  catchAsync(async (req, res, next) => {
    let result = await Request.find({ status: "active" }).populate({
      path: "user",
      select: "username",
    });
    res.status(200).json(result);
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    let result = await Request.findById(id).populate({
      path: "user",
      select: "username",
    });
    res.status(200).json(result);
  })
);

module.exports = router;
