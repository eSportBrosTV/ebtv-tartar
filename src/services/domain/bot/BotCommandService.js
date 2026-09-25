const ManagementDomainService = require("../../core/ManagementDomainService");
const BotCommandDataService = require("../../data/BotCommandDataService");
const SocketProvider = require("../../providers/SocketProvider");
const BotConfigService = require("./BotConfigService");

class BotCommandService extends ManagementDomainService {
    #configService
    #socket
    /**
     * @param {BotCommandDataService} botCommandData 
     * @param {BotConfigService} botConfigService 
     * @param {SocketProvider} socketProvider 
     */
    constructor(botCommandData, botConfigService, socketProvider) {
        super('BotCommand', botCommandData)

        this.#configService = botConfigService
        this.#socket = socketProvider
    }

    async getAllOfBot(botId){
        return await this._db.findCommandsByBot(botId)
    }

    async create(payload){
        const newBotCommand = await super.create(payload)

        await this.#sendConfigToBot(newBotCommand.bot_id)

        return newBotCommand
    }

    async update(idOrDoc, payload){
        const updatedBotCommand = await super.update(idOrDoc, payload)

        await this.#sendConfigToBot(updatedBotCommand.bot_id)

        return updatedBotCommand
    }

    async delete(idOrDoc){
        const deletedBotCommand = await super.delete(idOrDoc)

        await this.#sendConfigToBot(deletedBotCommand.bot_id)
    }

    async #sendConfigToBot(botId) {
        try {
            const newConfig = await this.#configService.generateConfig(botId)
            this.#socket.emitToBot(botId, "update_config", newConfig)
        } catch (err) {
            this._logError(err)
        }
    }
}

module.exports = BotCommandService