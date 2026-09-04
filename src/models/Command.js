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

const cleanCommandData = async (dataIds, mongooseContext) => {
  const ids = Array.isArray(dataIds) ? dataIds : [dataIds];
  if (ids.length === 0) return;

  await mongooseContext.model('BotCommand').deleteMany({ command_id: { $in: ids } });
};

commandSchema.pre('deleteOne', { document: true, query: false }, async function() {
  await cleanCommandData(this._id, this);
});

commandSchema.pre(['findOneAndDelete', 'findOneAndRemove'], async function() {
  const doc = await this.model.findOne(this.getQuery());
  if (doc) await cleanCommandData(doc._id, this);
});

commandSchema.pre('deleteMany', async function() {
  const docs = await this.model.find(this.getQuery());
  await cleanCommandData(docs.map(d => d._id), this);
});

module.exports = mongoose.model("Command", commandSchema, "command");
