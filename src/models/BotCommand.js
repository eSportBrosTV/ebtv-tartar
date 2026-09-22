const mongoose = require("mongoose");
const foreignKeyPlugin = require("../utils/foreignKeyPlugin");

const botCommandSchema = new mongoose.Schema(
  {
    bot_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bot'
    },
    command_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Command',
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

botCommandSchema.index({bot_id: 1, command_id: 1}, {unique: true})

foreignKeyPlugin(botCommandSchema)

module.exports = mongoose.model("BotCommand", botCommandSchema, "bot_command");