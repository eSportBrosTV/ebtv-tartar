const mongoose = require('mongoose');

const orgaSchema = new mongoose.Schema({
    orgaName: { type: String }
}, { timestamps: true });

const cleanOrgaData = async (dataIds, mongooseContext) => {
    const ids = Array.isArray(dataIds) ? dataIds : [dataIds];
    if (ids.length === 0) return;

    await mongooseContext.model('AssoMember').deleteMany({ orga: { $in: ids } });
};

commandSchema.pre('deleteOne', { document: true, query: false }, async function () {
    await cleanOrgaData(this._id, this);
});

commandSchema.pre(['findOneAndDelete', 'findOneAndRemove'], async function () {
    const doc = await this.model.findOne(this.getQuery());
    if (doc) await cleanOrgaData(doc._id, this);
});

commandSchema.pre('deleteMany', async function () {
    const docs = await this.model.find(this.getQuery());
    await cleanOrgaData(docs.map(d => d._id), this);
});

module.exports = mongoose.model('Orga', orgaSchema, 'orga');