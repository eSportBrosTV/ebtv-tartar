const { AssoMember } = require("../models");
const BasePolicy = require("./BasePolicy");

class OrgaPolicies extends BasePolicy {
    
    #getMembership = (req, getOrgId) => {
        const orgaId = getOrgId(req);
        
        const cacheKey = `orgaMembership_${orgaId}`;

        return this._getCached(req, cacheKey, async () => {
            if (!orgaId) return null;
            
            return await AssoMember.findOne({ 
                user: req.user.id, 
                orga: orgaId 
            });
        });
    };

    isMember = (getOrgId = (req) => req.ctx.orga._id) => async (req) => {
        const member = await this.#getMembership(req, getOrgId);
        return member ? true : "Vous ne faites pas partie de cette organisation.";
    }

    hasRole = (allowedRoles, getOrgId = (req) => req.ctx.orga._id) => async (req) => {
        const member = await this.#getMembership(req, getOrgId);

        if(!member) {
            throw new Error("hasRole utilisé sans isMember au préalable");
        }

        if(!allowedRoles.includes(member.role)){
            return `Action réservée aux rôles ${allowedRoles.join(', ')}`;
        }

        return true;
    }
}

module.exports = new OrgaPolicies();