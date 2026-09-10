const { AssoMember } = require("../models");
const BasePolicy = require("./BasePolicy");

class OrgaPolicies extends BasePolicy {
    
    #getMembership = (req, getId) => {
        const orgaId = getId(req);
        
        const cacheKey = `orgaMembership_${orgaId}`;

        return this._getCached(req, cacheKey, async () => {
            if (!orgaId) return null;
            
            return await AssoMember.findOne({ 
                user: req.user.id, 
                orga: orgaId 
            });
        });
    };

    isMember = (getId = (req) => req.params.orgId || req.query.orgId) => async (req) => {
        const member = await this.#getMembership(req, getId);
        return member ? true : "Vous ne faites pas partie de cette organisation.";
    }

    hasRole = (allowedRoles, getId = (req) => req.params.orgId || req.query.orgId) => async (req) => {
        const member = await this.#getMembership(req, getId);

        if(!member) {
            throw new Error("hasRole utilisé sans isMember au préalable (ou ressource introuvable)");
        }

        if(!allowedRoles.includes(member.role)){
            return `Action réservée aux rôles ${allowedRoles.join(', ')}`;
        }

        return true;
    }
}

module.exports = new OrgaPolicies();