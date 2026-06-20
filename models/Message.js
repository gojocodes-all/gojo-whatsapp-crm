const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    from: String,
    name: String,
    message: String,
    type: {
      type: String,
      default: "text"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Message", messageSchema);
