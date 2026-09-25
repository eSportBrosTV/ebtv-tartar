const { AssoMember } = require("../../models");
const DataService = require("../core/DataService");

class AssoMemberDataService extends DataService {
    constructor(){
        super(AssoMember)
    }

    async findMembersByOrga(orgId) {
        return await this.find({ orga: orgId });
    }

    async findMembership(userId, orgId) {
        return await this.findOne({ user: userId, orga: orgId });
    }
}

module.exports = AssoMemberDataService
