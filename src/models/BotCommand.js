const mongoose = require("mongoose");

const botCommandSchema = new mongoose.Schema(
  {
    bot_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'bot'
    },
    command_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'command',
        required: true
    },
    active: {
        type: Boolean,
        required: true
    },
    params: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
        default: {}
    }
  }
);

module.exports = mongoose.model("BotCommand", botCommandSchema, "bot_command");