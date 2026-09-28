const mongoose = require("mongoose");

const paramDefSchema = new mongoose.Schema(
  {
    key: {
        type: String,
        required: true
    },
    label: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    type: {
        type: String,
        required: true
    },
    required: {
        type: Boolean,
        required: true,
        default: false
    },
    multiple: {
        type: Boolean,
        required: true,
        default: false
    },
    default: {
        type: mongoose.Schema.Types.Mixed
    },
    constraints: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
  },
  { _id: false }
);

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
    paramDefs: {
        type: [paramDefSchema],
        default: []
    }
  }
);

const cleanCommandData = async (dataIds) => {
  const ids = Array.isArray(dataIds) ? dataIds : [dataIds];
  if (ids.length === 0) return;

  await mongoose.model('BotCommand').deleteMany({ command_id: { $in: ids } });
};

commandSchema.pre('deleteOne', { document: true, query: false }, async function() {
  await cleanCommandData(this._id);
});

commandSchema.pre(['findOneAndDelete', 'findOneAndRemove'], async function() {
  const doc = await this.model.findOne(this.getQuery());
  if (doc) await cleanCommandData(doc._id);
});

commandSchema.pre('deleteMany', async function() {
  const docs = await this.model.find(this.getQuery());
  await cleanCommandData(docs.map(d => d._id));
});

module.exports = mongoose.model("Command", commandSchema, "command");
