const router = require("express").Router();
const apiRoutes = require("./api/index.js");
const htmlRoutes = require("./htmlRoutes.js");

router.use("/api", apiRoutes);
router.use("/", htmlRoutes);

module.exports = router;
