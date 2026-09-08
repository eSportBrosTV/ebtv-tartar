const { AssoMember } = require("../models");
const BasePolicy = require("./BasePolicy");

class OrgaPolicies extends BasePolicy {
    #getMembership = (req, paramName = 'orgId') => {
        const orgaId = req.params[paramName] || req.query[paramName];
        
        const cacheKey = `orgaMembership_${orgaId}`;

        return this._getCached(req, cacheKey, async () => {
            if (!orgaId) return null;
            
            return await AssoMember.findOne({ 
                user: req.user.id, 
                orga: orgaId 
            });
        });
    };

    isMember = (paramName = 'orgId') => async (req) => {
        const member = await this.#getMembership(req, paramName)
        return member ? true : "Vous ne faite pas parti de cette organisation"
    }

    hasRole = (allowedRoles, paramName = 'orgId') => async (req) => {
        const memberResult = await this.isMember(paramName)(req)

        if(memberResult != true){
            return memberResult
        }

        const member = await this.#getMembership(req, paramName)

        if(!allowedRoles.includes(member.role)){
            return `Action reserver aux roles ${allowedRoles.join(', ')}`
        }

        return true
    }
}

module.exports = new OrgaPolicies()