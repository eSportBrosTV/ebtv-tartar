const BasePolicy = require("./BasePolicy");

class HierarchyPolicies extends BasePolicy {
    
    isChildOf = (getParentId, getChildParentId) => async (req) => {
        const parentId = getParentId(req);
        const childParentId = getChildParentId(req);

        if (!parentId || !childParentId) {
            throw new Error("ID manquant dans le contexte");
        }
        if (parentId.toString() !== childParentId.toString()) {
            return "Acces refuse : Incoherence des ressources."; 
        }

        return true;
    };
}

module.exports = new HierarchyPolicies();