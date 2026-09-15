const BasePolicy = require("./BasePolicy");

class UserPolicies extends BasePolicy{
    isMe = (getUserId = (req) => req.user._id, getRessourceUserId = (req) => req.ctx.user._id) => (req) => {
        const userId = getUserId(req)
        const ressourceUserId = getRessourceUserId(req)

        if(!userId || !ressourceUserId){
            throw new Error("User ID manquant")
        }

        if(userId.toString() !== ressourceUserId.toString()){
            return "Impossible d'acceder a un utilisateur qui n'est pas vous"
        }

        return true
    }
}

module.exports = new UserPolicies()