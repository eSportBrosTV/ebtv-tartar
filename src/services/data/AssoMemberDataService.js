const { AssoMember } = require("../../models");
const DataService = require("../core/DataService");

class AssoMemberDataService extends DataService {
    constructor(){
        super(AssoMember)
    }

    async findMembersByOrga(orgId) {
        return await this.find({ orga: orgId });
    }
}

module.exports = AssoMemberDataService
