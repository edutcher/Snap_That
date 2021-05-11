const router = require("express").Router();
const userRoutes = require("./userRoutes");
const photoRoutes = require("./photoRoutes");
const requestRoutes = require("./requestRoutes");

router.use("/users", userRoutes);
router.use("/photos", photoRoutes);
router.use("/requests", requestRoutes);

module.exports = router;
