const BasePolicy = require("./BasePolicy");

class AdminPolicies extends BasePolicy {
    isAdmin = (req) => {
        if (!req.user) return "Vous n'etes pas connecter"

        if (req.user.roles !== "admin") {
            return "Vous n'etes pas admin"
        }

        return true
    }
}

module.exports = new AdminPolicies()