const BaseDomainService = require("../../core/BaseDomainService");

class AuthService extends BaseDomainService {
    #userManage
    /**
     * 
     * @param {import('../../domain/user/UserManagementService')} userManage
     */
    constructor(userManage){
        super('Auth')
        this.#userManage = userManage
    }

    async register(payload){
        const newUser = await this.#userManage.create(payload)

        const safeUser = newUser.toObject()
        delete safeUser.password

        this._logInfo(`Nouvel utilisateur : ${safeUser.username} (${safeUser._id})`)

        return safeUser
    }
}

module.exports = AuthService