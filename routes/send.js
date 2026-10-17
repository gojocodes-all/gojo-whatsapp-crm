const express = require("express");
const whatsappClient = require("../services/whatsappClient");

const router = express.Router();

router.post("/", async (req, res) => {
  const { to, message } = req.body || {};

  if (
    typeof to !== "string" ||
    !to.trim() ||
    typeof message !== "string" ||
    !message.trim()
  ) {
    return res.status(400).json({
      error: '"to" and "message" must be non-empty strings.',
    });
  }

  try {
    const response = await whatsappClient.sendText(to, message);

    res.json(response.data);
  } catch (err) {
    console.log(err.response?.data || err.message);
    res.status(500).json({
      error: err.response?.data || err.message,
    });
  }
});

module.exports = router;
