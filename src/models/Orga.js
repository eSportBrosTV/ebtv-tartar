const mongoose = require('mongoose');

const orgaSchema = new mongoose.Schema({
    orgaName: { type: String }
}, { timestamps: true });

const cleanOrgaData = async (dataIds) => {
    const ids = Array.isArray(dataIds) ? dataIds : [dataIds];
    if (ids.length === 0) return;

    await mongoose.model('AssoMember').deleteMany({ orga: { $in: ids } });
};

orgaSchema.pre('deleteOne', { document: true, query: false }, async function () {
    await cleanOrgaData(this._id);
});

orgaSchema.pre(['findOneAndDelete', 'findOneAndRemove'], async function () {
    const doc = await this.model.findOne(this.getQuery());
    if (doc) await cleanOrgaData(doc._id);
});

orgaSchema.pre('deleteMany', async function () {
    const docs = await this.model.find(this.getQuery());
    await cleanOrgaData(docs.map(d => d._id));
});

module.exports = mongoose.model('Orga', orgaSchema, 'orga');