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

    async authenticate(username, password){
        const user = await this.#userManage.getByUsernameWithPassword(username)

        if(!user || !(await user.correctPassword(password, user.password))){
            this._throwError("Pseudo ou mot de passe incorrect", ErrorCodes.UNAUTHORIZED)
        }

        return user
    }

    login(user){
        return this.#toSafeUser(user)
    }

    isSessionCurrent(user, sessionVersion){
        return sessionVersion === undefined || sessionVersion === user.sessionVersion
    }

    async validateSession(userId, sessionVersion){
        const user = await this.#userManage.getById(userId)

        if(!this.isSessionCurrent(user, sessionVersion)){
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