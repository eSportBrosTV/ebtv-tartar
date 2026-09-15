const BaseDomainService = require("../../core/BaseDomainService");

class AuthService extends BaseDomainService {
    #userDb
    /**
     * 
     * @param {import('../../core/DataService')} userData 
     */
    constructor(userData){
        super('Auth')
        this.#userDb = userData
    }

    async register(payload){
        const newUser = await this.#userDb.create(payload)

        const safeUser = newUser.toObject()
        delete safeUser.password

        this._logInfo(`Nouvel utilisateur : ${safeUser.username} (${safeUser._id})`)

        return safeUser
    }
}

module.exports = AuthService