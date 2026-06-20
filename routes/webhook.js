const express = require("express");
const router = express.Router();

const VERIFY_TOKEN = "gojo_whatsapp_secret_2026";

router.get("/", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook verified!");
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

router.post("/", (req, res) => {
  console.log(
    JSON.stringify(req.body, null, 2)
  );

  return res.sendStatus(200);
});

module.exports = router;
