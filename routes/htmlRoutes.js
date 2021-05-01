const router = require("express").Router();
const path = require("path");

router.get("/", (req, res) => {
  console.log("here?");
  res.sendFile(path.join(__dirname, "/index.html"));
});

module.exports = router;
