const jwt = require("jsonwebtoken");
const ErrorCodes = require("../../../utils/errors/ErrorCodes");
const BaseDomainService = require("../../core/BaseDomainService");
const BotDataService = require("../../data/BotDataService");

class BotAuthService extends BaseDomainService {
    #db
    /**
     * @param {BotDataService} botData
     */
    constructor(botData){
        super('BotAuth')
        this.#db = botData
    }

    generateToken(bot){
        return jwt.sign(
            {
                orca_id: bot._id.toString(),
                created_at: Date.now(),
            },
            process.env.JWT_SECRET
        )
    }

    async verifyToken(token){
        let payload

        try {
            payload = jwt.verify(token, process.env.JWT_SECRET)
        } catch {
            this._throwError("Token corrompu ou invalide", ErrorCodes.UNAUTHORIZED)
        }

        const botExist = await this.#db.exist({ _id: payload.orca_id })

        if(!botExist){
            this._throwError(`Le bot ${payload.orca_id} n'existe plus`, ErrorCodes.UNAUTHORIZED)
        }

        return payload.orca_id
    }
}

module.exports = BotAuthService
