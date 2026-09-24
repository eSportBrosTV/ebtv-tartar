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

        this._logInfo(`Nouvel utilisateur : ${newUser.username} (${newUser._id})`)

        return this.#toSafeUser(newUser)
    }

    login(user){
        return this.#toSafeUser(user)
    }

    #toSafeUser(user){
        const { password, ...safeUser } = user.toJSON()

        return safeUser
    }
}

module.exports = AuthService