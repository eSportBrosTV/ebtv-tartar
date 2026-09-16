// services/Core/CrudDomainService.js
const ErrorCodes = require('../../utils/errors/ErrorCodes');
const BaseDomainService = require('./BaseDomainService');
const DataService = require('./DataService');

/**
 * @template T
 */
class ManagementDomainService extends BaseDomainService {
    /**@type {DataService<T>} */
    /**
     * 
     * @param {String} serviceName 
     * @param {DataService} dataService 
     */
    constructor(serviceName, dataService) {
        super(serviceName);
        this.db = dataService;
    }
    async _beforeCreate(payload) { 
        return payload; 
    }
    
    async _beforeUpdate(doc, payload) { 
        return payload; 
    }
    
    async _beforeDelete(doc) { 
        return true; 
    }

    async getAll() {
        return await this.db.find({});
    }

    async getById(id) {
        const doc = await this.db.findById(id);
        if (!doc) this._throwError("Document introuvable", ErrorCodes.NOT_FOUND);
        return doc;
    }

    async create(payload) {
        const safePayload = await this._beforeCreate(payload);
        
        this._logInfo("Creation d'un nouveau document");
        
        return await this.db.create(safePayload);
    }

    async update(idOrDoc, payload) {
        const doc = await this._resolveDocument(this.db, idOrDoc);

        const safePayload = await this._beforeUpdate(doc, payload);

        this._logInfo(`Mise a jour du document ${doc._id}`);

        return await this.db.updateById(doc._id, safePayload);
    }

    async delete(idOrDoc) {
        const doc = await this._resolveDocument(this.db, idOrDoc);
        console.log(doc)

        await this._beforeDelete(doc);

        this._logInfo(`Suppression du document ${doc._id}`);

        return await this.db.deleteById(doc._id);
    }
}

module.exports = ManagementDomainService;