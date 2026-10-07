const ErrorCodes = require("../../../utils/errors/ErrorCodes");
const zodErrorDetails = require("../../../utils/errors/zodErrorDetails");
const BaseDomainService = require("../../core/BaseDomainService");
const BotDataService = require("../../data/BotDataService");
const SocketProvider = require("../../providers/SocketProvider");
const { getPlatform } = require("../../../platforms");
const BotConfigService = require("./BotConfigService");

class BotPlatformService extends BaseDomainService {
    #botDb
    #configService
    #socket
    /**
     * @param {BotDataService} botData
     * @param {BotConfigService} botConfigService
     * @param {SocketProvider} socketProvider
     */
    constructor(botData, botConfigService, socketProvider) {
        super('BotPlatform')

        this.#botDb = botData
        this.#configService = botConfigService
        this.#socket = socketProvider
    }

    async set(botOrId, { platformId, params }) {
        const bot = await this._resolveDocument(this.#botDb, botOrId)

        const choice = platformId === null
            ? { id: null, params: {}, secrets: {} }
            : await this.#buildChoice(bot, platformId, params)

        this._logInfo(`Mise a jour de la plateforme du bot ${bot._id}`)

        await this.#botDb.updateById(bot._id, { platform: choice })

        await this.#sendConfigToBot(bot._id)

        return await this.#configService.getPlatformChoice(bot._id)
    }

    async #buildChoice(bot, platformId, params) {
        const platform = getPlatform(platformId)

        if (!platform) {
            this._throwError(`Plateforme inconnue : ${platformId}`, ErrorCodes.BAD_REQUEST)
        }

        const { secretKeys } = platform
        const stored = await this.#botDb.findById(bot._id, '+platform.secrets')
        const previousSecrets = stored?.platform?.id === platform.id ? stored.platform.secrets ?? {} : {}

        const kept = Object.entries(previousSecrets).filter(([key]) => secretKeys.has(key) && !Object.hasOwn(params, key))
        const submitted = Object.entries(params).filter(([key, value]) => !(secretKeys.has(key) && value === null))

        const result = platform.schema.safeParse(Object.fromEntries([...kept, ...submitted]))

        if (!result.success) {
            this._throwError("Parametres de plateforme invalides", ErrorCodes.BAD_REQUEST, zodErrorDetails(result.error))
        }

        const entries = Object.entries(result.data)

        return {
            id: platform.id,
            params: Object.fromEntries(entries.filter(([key]) => !secretKeys.has(key))),
            secrets: Object.fromEntries(entries.filter(([key]) => secretKeys.has(key)))
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

module.exports = BotPlatformService
