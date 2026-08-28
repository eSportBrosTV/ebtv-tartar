const mongoose = require("mongoose");
const { type, required } = require("../schemas/command/create");

const botSchema = new mongoose.Schema({
  orga: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "orga",
  },
  token: {
    type: String,
    required: true,
  },
  serv: {
    type: String,
    required: true,
  },
  logChannel: {
    type: String,
    required: true,
  },
  isOnline: {
    type: Boolean,
    required: true,
    default: false
  },
  requireFirstDeploy: {
    type: Boolean,
    required: true,
    default: true,
  },
});

module.exports = mongoose.model("Bot", botSchema, "bot");
