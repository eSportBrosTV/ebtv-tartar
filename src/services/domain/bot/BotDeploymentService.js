// services/Domain/Bot/BotDeploymentService.js
const ErrorCodes = require('../../../utils/errors/ErrorCodes');
const BaseDomainService = require('../../core/BaseDomainService');


const jwt = require("jsonwebtoken");
const DataService = require('../../core/DataService');
const DockerProvider = require('../../providers/DockerProvider');
const SocketProvider = require('../../providers/SocketProvider');

class BotDeploymentService extends BaseDomainService {
    #db
    #docker
    #socket
    /**
     * 
     * @param {DataService} botData 
     * @param {DockerProvider} dockerProvider 
     * @param {SocketProvider} socketProvider 
     */
    constructor(botData, dockerProvider, socketProvider) {

        super('BotDeployment');
        this.#db = botData;
        this.#docker = dockerProvider;
        this.#socket = socketProvider;
    }

    async deployBot(botOrId, withStart = false) {
        const bot = await this._resolveDocument(this.#db, botOrId)

        const tartarToken = jwt.sign(
            {
                orca_id: bot._id.toString(),
                created_at: Date.now(),
            },
            process.env.JWT_SECRET
        )

        const containerId = await this.#docker.createContainer({
            botId: bot._id.toString(),
            tartarToken: tartarToken,
            disToken: bot.token
        })

        bot.containerId = containerId

        if(withStart){
            await this.#docker.startContainer(containerId)
        }

        return await bot.save()
    }

    async startBot(botOrId) {
        const bot = await this._resolveDocument(this.#db, botOrId);

        const exists = await this.#docker.checkContainerExist(bot.containerId);
        if (!exists) {
            this._throwError(`Le conteneur du bot ${bot._id} n'existe pas`, ErrorCodes.NOT_FOUND);
        }

        await this.#docker.startContainer(bot.containerId);
    }

    async stopBot(botOrId) {
        const bot = await this._resolveDocument(this.#db, botOrId);

        await this.#socket.emitStopAndWait(bot._id.toString());

        await this.#docker.stopContainer(bot.containerId);
    }

    async destroyBot(botOrId, force = false) {
        const bot = await this._resolveDocument(this.#db, botOrId);

        await this.#socket.emitStopAndWait(bot._id.toString(), force);
        await this.#docker.destroyContainer(bot.containerId);

        await bot.deleteOne(); 
    }
}
module.exports = BotDeploymentService;