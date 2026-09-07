const mongoose = require("mongoose");
const { type, required } = require("../schemas/command/create");
const foreignKeyPlugin = require("../utils/foreignKeyPlugin");

const botSchema = new mongoose.Schema({
  orga: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Orga",
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
  containerId: {
    type: String,
    default: null
  }
});

const cleanUpBotData = async (botIds, mongooseContext) => {
  const ids = Array.isArray(botIds) ? botIds : [botIds];
  if (ids.length === 0) return;

  await mongooseContext.model('BotCommand').deleteMany({ bot_id: { $in: ids } });
};

botSchema.pre('deleteOne', { document: true, query: false }, async function() {
  await cleanUpBotData(this._id, this);
});

botSchema.pre(['findOneAndDelete', 'findOneAndRemove'], async function() {
  const doc = await this.model.findOne(this.getQuery());
  if (doc) await cleanUpBotData(doc._id, this);
});

botSchema.pre('deleteMany', async function() {
  const docs = await this.model.find(this.getQuery());
  await cleanUpBotData(docs.map(d => d._id), this);
});

foreignKeyPlugin(botSchema)

module.exports = mongoose.model("Bot", botSchema, "bot");
