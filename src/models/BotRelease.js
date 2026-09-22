const mongoose = require("mongoose");

const botReleaseSchema = new mongoose.Schema({
  version: {
    type: String,
    required: true,
    unique: true
  },
  changelog: {
    type: String,
    default: ""
  },
  releaseDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("BotRelease", botReleaseSchema, "bot_release");
