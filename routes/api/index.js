const router = require("express").Router();
const userRoutes = require("./userRoutes");
const photoRoutes = require("./photoRoutes");
const requestRoutes = require("./requestRoutes");
const notificationRoutes = require("./notificationRoutes");

router.use("/users", userRoutes);
router.use("/photos", photoRoutes);
router.use("/requests", requestRoutes);
router.use("/notifications", notificationRoutes);

module.exports = router;
