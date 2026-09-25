const BaseDomainService = require("../../core/BaseDomainService");
const BotDataService = require("../../data/BotDataService");
const SocketProvider = require("../../providers/SocketProvider");

class BotPresenceService extends BaseDomainService {
    #db
    #socket
    /**
     * @param {BotDataService} botData
     * @param {SocketProvider} socketProvider
     */
    constructor(botData, socketProvider){
        super('BotPresence')
        this.#db = botData
        this.#socket = socketProvider
    }

    async markOnline(botId){
        await this.#db.updateById(botId, { isOnline: true })
    }

    async markOffline(botId){
        const stillConnected = await this.#socket.isBotConnected(botId)
        if(stillConnected) return

        const botExist = await this.#db.exist({ _id: botId })
        if(!botExist) return

        await this.#db.updateById(botId, { isOnline: false })
    }

    async resetAll(){
        await this.#db.updateMany({}, { isOnline: false })
    }
}

module.exports = BotPresenceService
