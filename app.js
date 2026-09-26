const cors = require("cors");
const express = require("express");

const messageRoutes = require("./routes/messages");
const sendRoutes = require("./routes/send");
const webhookRoutes = require("./routes/webhook");

function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use("/webhook", webhookRoutes);
  app.use("/messages", messageRoutes);
  app.use("/send", sendRoutes);

  app.get("/", (req, res) => {
    res.send("GOJO WhatsApp CRM running 🚀");
  });

  return app;
}

module.exports = createApp;
