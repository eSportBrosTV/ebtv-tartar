const ErrorCodes = require("../../../utils/errors/ErrorCodes");
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

    async validateSession(userId, sessionVersion){
        const user = await this.#userManage.getById(userId)

        if(sessionVersion !== undefined && sessionVersion !== user.sessionVersion){
            this._throwError("Session expiree suite a un changement de mot de passe", ErrorCodes.UNAUTHORIZED)
        }

        return user
    }

    #toSafeUser(user){
        const { password, ...safeUser } = user.toJSON()

        return safeUser
    }
}

module.exports = AuthService