const ErrorCodes = require("../../../utils/errors/ErrorCodes");
const DataService = require("../../core/DataService");
const ManagementDomainService = require("../../core/ManagementDomainService");
const AssoMemberDataService = require("../../data/AssoMemberDataService");

class OrgaMemberService extends ManagementDomainService {
    #userDb
    /**
     * @param {AssoMemberDataService} assoMemberData
     * @param {DataService} userData
     */
    constructor(assoMemberData, userData){
        super("OrgaMember", assoMemberData)
        this.#userDb = userData
    }

    async getAllOfOrga(orgId){
        return await this.db.findMembersByOrga(orgId)
    }

    async _beforeCreate(payload){
        const userExist = await this.#userDb.exist({ _id: payload.user })

        if(!userExist){
            this._throwError("Utilisateur introuvable", ErrorCodes.NOT_FOUND)
        }

        return payload
    }
}

module.exports = OrgaMemberService
