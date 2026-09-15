const ErrorCodes = require('../../utils/errors/ErrorCodes');
const BaseService = require('./BaseService');
const DataService = require('./DataService');

class BaseDomainService extends BaseService {
    constructor(serviceName) {
        super(serviceName);
    }
    
    /**
     * 
     * @param {DataService} dataService 
     * @param {String || Object} idOrDocument 
     * @returns 
     */
    async _resolveDocument(dataService, idOrDocument) {
        const isMongooseDoc = idOrDocument 
            && typeof idOrDocument === 'object' 
            && typeof idOrDocument.save === 'function';

        if (isMongooseDoc) {
            return idOrDocument;
        }

        const idToSearch = (idOrDocument && typeof idOrDocument === 'object' && idOrDocument._id) 
            ? idOrDocument._id 
            : idOrDocument;

        const doc = await dataService.findById(idToSearch);

        if (!doc) {
            this.throwError("Document introuvable", ErrorCodes.NOT_FOUND);
        }

        return doc; 
    }
}
module.exports = BaseDomainService;