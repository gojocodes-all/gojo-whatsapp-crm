const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const {
  sendMainMenu,
  sendServicesMenu,
} = require("../controllers/botController");
const { processWebhookBody } = require("../services/webhookProcessor");

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

router.post("/", async (req, res) => {
  try {
    const body = req.body;
    console.log(JSON.stringify(body, null, 2));

    const messageCount = await processWebhookBody(body, {
      Message,
      Conversation,
      sendMainMenu,
      sendServicesMenu,
    });

    if (messageCount > 0) {
      console.log(
        `${messageCount} message${messageCount === 1 ? "" : "s"} saved!`
      );
    }

    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

module.exports = router;
