const router = require("express").Router();
const Request = require("../../models/Request.js");
const User = require("../../models/User.js");

router.post("/new", async (req, res) => {
  try {
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
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/approve", async (req, res) => {
  try {
    if (req.user.isAdmin) {
      const { id } = req.body;
      let result = await Request.findByIdAndUpdate(id, { status: "active" });
      res.status(200).json(result);
    } else {
      res.status(400).send("Unauthorized");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/fill", async (req, res) => {
  try {
    const { id, photo, userId } = req.body;
    let result = await Request.findByIdAndUpdate(id, {
      status: "filled",
      photo,
      filled_by: userId,
    });
    const filledUser = await User.findById(userId);
    filledUser.requests_filled.push(id);
    await filledUser.save();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/complete", async (req, res) => {
  try {
    const { id } = req.body;
    let result = await Request.findByIdAndUpdate(id, { status: "completed" });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/deny", async (req, res) => {
  try {
    const { id } = req.body;
    let result = await Request.findByIdAndUpdate(id, { status: "denied" });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/pending", async (req, res) => {
  try {
    if (req.user.isAdmin) {
      let result = await Request.find({ status: "pending" }).populate({
        path: "user",
        select: "username",
      });
      res.status(200).json(result);
    } else {
      res.status(400).send("Unauthorized");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/active", async (req, res) => {
  try {
    let result = await Request.find({ status: "active" }).populate({
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
    let result = await Request.findById(id).populate({
      path: "user",
      select: "username",
    });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
