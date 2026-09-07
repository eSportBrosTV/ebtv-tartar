const mongoose = require("mongoose");
const foreignKeyPlugin = require("../utils/foreignKeyPlugin");

const assoMemberShecma = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  orga: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Orga",
    required: true
  },
  role: {
    type: String,
    enum: ['owner', 'member'],
    default: 'member',
    required: true
  },
  joinedAt: {
    type: Date,
    default: Date.now,
    required: true
  }
});


assoMemberShecma.index({user: 1, orga: 1}, {unique: true})

foreignKeyPlugin(assoMemberShecma)

module.exports = mongoose.model("AssoMember", assoMemberShecma, "asso_member");