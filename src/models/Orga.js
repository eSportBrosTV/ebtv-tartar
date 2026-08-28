const mongoose = require('mongoose');

const orgaSchema = new mongoose.Schema({
    orgaName: {type: String}
}, { timestamps: true });

module.exports = mongoose.model('Orga', orgaSchema, 'orga');