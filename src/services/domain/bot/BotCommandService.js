const ErrorCodes = require("../../../utils/errors/ErrorCodes");
const zodErrorDetails = require("../../../utils/errors/zodErrorDetails");
const DataService = require("../../core/DataService");
const ManagementDomainService = require("../../core/ManagementDomainService");
const BotCommandDataService = require("../../data/BotCommandDataService");
const SocketProvider = require("../../providers/SocketProvider");
const { buildValuesSchema } = require("../../../utils/commandParams");
const BotConfigService = require("./BotConfigService");

class BotCommandService extends ManagementDomainService {
    #commandDb
    #configService
    #socket
    /**
     * @param {BotCommandDataService} botCommandData
     * @param {DataService} commandData
     * @param {BotConfigService} botConfigService
     * @param {SocketProvider} socketProvider
     */
    constructor(botCommandData, commandData, botConfigService, socketProvider) {
        super('BotCommand', botCommandData)

        this.#commandDb = commandData
        this.#configService = botConfigService
        this.#socket = socketProvider
    }

    async _beforeCreate(payload){
        await this.#validateParams(payload.command_id, payload.params)
        return payload
    }

    async _beforeUpdate(doc, payload){
        await this.#validateParams(doc.command_id, payload.params)
        return payload
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

    async #validateParams(commandId, params) {
        if (params === undefined) return

        const command = await this.#commandDb.findByIdOrThrow(commandId, "Commande introuvable")
        const result = buildValuesSchema(command.paramDefs).safeParse(params)

        if (!result.success) {
            this._throwError("Parametres de commande invalides", ErrorCodes.BAD_REQUEST, zodErrorDetails(result.error))
        }
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