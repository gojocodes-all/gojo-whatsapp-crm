const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const webhookRoutes = require("./routes/webhook");
const messageRoutes = require("./routes/messages");

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/webhook", webhookRoutes);
app.use("/messages", messageRoutes);
app.use("/send", require("./routes/send"));

app.get("/", (req, res) => {
  res.send("GOJO WhatsApp CRM running 🚀");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
