const ManagementDomainService = require("../../core/ManagementDomainService");
const OrgaDataService = require("../../data/OrgaDataService");

class OrgaManagementService extends ManagementDomainService {
    /**
     * @param {OrgaDataService} orgaData
     */
    constructor(orgaData){
        super("OrgaManagement", orgaData)
    }
}

module.exports = OrgaManagementService
