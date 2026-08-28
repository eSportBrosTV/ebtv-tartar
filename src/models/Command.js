const mongoose = require("mongoose");

const commandSchema = new mongoose.Schema(
  {
    internalID: {
        type: String,
        required: true
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      default: 'Une commande de fou'
    },
    active: {
        type: Boolean,
        required: true,
        default: true
    },
    params: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
        default: {}
    }
  }
);

module.exports = mongoose.model("Command", commandSchema, "command");
