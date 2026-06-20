const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const {
  sendText,
  sendMainMenu,
} = require("../controllers/botController");

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
    console.log(
  JSON.stringify(body, null, 2)
);
    if (
      body.object === "whatsapp_business_account" &&
      body.entry?.[0]?.changes?.[0]?.value?.messages
    ) {
      const msg =
        body.entry[0].changes[0].value.messages[0];

      const contact =
        body.entry[0].changes[0].value.contacts?.[0];

      await Message.create({
        from: msg.from,
        name: contact?.profile?.name || "Unknown",
        message: msg.text?.body || "",
        type: msg.type,
      });

      console.log("Message saved!");
const phone = msg.from;
const text = msg.text?.body?.trim();

let convo = await Conversation.findOne({
  phone,
});

if (!convo) {
  convo = await Conversation.create({
    phone,
  });
}

if (
  text &&
  ["hi", "hello", "hey", "menu", "start"].includes(
    text.toLowerCase()
  )
) {
  await sendMainMenu(phone);
}
    }

    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

module.exports = router;
