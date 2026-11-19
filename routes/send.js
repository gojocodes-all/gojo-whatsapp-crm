const express = require("express");
const axios = require("axios");

const router = express.Router();

router.post("/", async (req, res) => {
  const { to, message } = req.body;

  try {
    const response = await axios.post(
      `https://graph.facebook.com/v23.0/${process.env.PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: to,
        text: {
          body: message,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    console.log(err.response?.data || err.message);
    res.status(500).json({
      error: err.response?.data || err.message,
    });
  }
});

module.exports = router;
