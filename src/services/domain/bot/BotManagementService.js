const ErrorCodes = require("../../../utils/errors/ErrorCodes");
const ManagementDomainService = require("../../core/ManagementDomainService");
const BotDataService = require("../../data/BotDataService");
const SocketProvider = require("../../providers/SocketProvider");
const BotConfigService = require("./BotConfigService");

class BotManagementService extends ManagementDomainService {
    #configService
    #socket
    /**
     * 
     * @param {BotDataService} botData 
     * @param {BotConfigService} botConfigService 
     * @param {SocketProvider} socketProvider 
     */
    constructor(botData, botConfigService, socketProvider){
        super("BotManagement", botData)
        this.#configService = botConfigService
        this.#socket = socketProvider
    }

    async getDiscordToken(botOrId){
        const botId = botOrId?._id || botOrId
        const bot = await this._db.findById(botId, '+token')

        if(!bot){
            this._throwError("Bot introuvable", ErrorCodes.NOT_FOUND)
        }

        return bot.token
    }

    async _beforeCreate(payload){
        payload.isOnline = false
        payload.requireFirstDeploy = true

        return payload
    }

    async _beforeUpdate(doc, payload){
        delete payload.containerId

        return payload
    }

    async _beforeDelete(doc){
        if(doc.isOnline){
            this._throwError("Impossible de supprimer un bot en ligne", ErrorCodes.BAD_STATE)
        }

        return true
    }

    async update(idOrDoc, payload){
        const updatedBot = await super.update(idOrDoc, payload)

        try {
            const newConfig = await this.#configService.generateConfig(updatedBot)

            this.#socket.emitToBot(updatedBot._id, "update_config", newConfig)
        } catch (err) {
            console.error(err)
        }

        return updatedBot
    }
}

module.exports = BotManagementService