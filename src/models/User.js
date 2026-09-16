const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    password: {
      type: String,
      select: false,
    },
    roles: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      required: true,
    },
    sessionVersion: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], async function () {
  const update = this.getUpdate();
  const password = update.password || (update.$set && update.$set.password);

  if (!password) return;

  const hashed = await bcrypt.hash(password, 12);

  if (update.password) {
    update.password = hashed;
  }
  if (update.$set && update.$set.password) {
    update.$set.password = hashed;
  }

  update.$inc = update.$inc || {};
  update.$inc.sessionVersion = 1;
});

const cleanUserData = async (dataIds, mongooseContext) => {
  const ids = Array.isArray(dataIds) ? dataIds : [dataIds];
  if (ids.length === 0) return;

  await mongooseContext.model('AssoMember').deleteMany({ user: { $in: ids } });
};

commandSchema.pre('deleteOne', { document: true, query: false }, async function () {
  await cleanUserData(this._id, this);
});

commandSchema.pre(['findOneAndDelete', 'findOneAndRemove'], async function () {
  const doc = await this.model.findOne(this.getQuery());
  if (doc) await cleanUserData(doc._id, this);
});

commandSchema.pre('deleteMany', async function () {
  const docs = await this.model.find(this.getQuery());
  await cleanUserData(docs.map(d => d._id), this);
});

userSchema.methods.correctPassword = async function (givenPwd, dbPwd) {
  return await bcrypt.compare(givenPwd, dbPwd)
}

module.exports = mongoose.model("User", userSchema, "user");
