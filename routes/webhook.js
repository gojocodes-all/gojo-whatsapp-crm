const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Webhook works 🚀");
});

module.exports = router;
