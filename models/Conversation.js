const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  state: {
    type: String,
    default: "main",
  },
  data: {
    type: Object,
    default: {},
  },
});

module.exports = mongoose.model(
  "Conversation",
  conversationSchema
);
