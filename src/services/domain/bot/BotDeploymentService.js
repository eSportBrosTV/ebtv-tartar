// services/Domain/Bot/BotDeploymentService.js
const ErrorCodes = require('../../../utils/errors/ErrorCodes');
const BaseDomainService = require('../../core/BaseDomainService');


const jwt = require("jsonwebtoken");
const DataService = require('../../core/DataService');
const DockerProvider = require('../../providers/DockerProvider');
const SocketProvider = require('../../providers/SocketProvider');
const ReleaseDataService = require('../../data/ReleaseDataService');

class BotDeploymentService extends BaseDomainService {
    #db
    #docker
    #socket
    #releaseDb
    /**
     * 
     * @param {DataService} botData 
     * @param {ReleaseDataService} releaseData
     * @param {DockerProvider} dockerProvider 
     * @param {SocketProvider} socketProvider 
     */
    constructor(botData, releaseData, dockerProvider, socketProvider) {

        super('BotDeployment');
        this.#db = botData;
        this.#releaseDb = releaseData
        this.#docker = dockerProvider;
        this.#socket = socketProvider;
    }

    async deployBot(botOrId, withStart = false) {
        const bot = await this._resolveDocument(this.#db, botOrId)

        const targetVersion = await this.#releaseDb.getLatestRelease()

        const tartarToken = this._generateToken(bot)

        const containerId = await this.#docker.createContainer({
            botId: bot._id.toString(),
            tartarToken: tartarToken,
            disToken: bot.token,
            version: targetVersion
        })

        bot.containerId = containerId
        bot.version = targetVersion

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

    async updateBot(botOrId) {
        const bot = await this._resolveDocument(this.#db, botOrId);

        if (bot.updateStatus === 'UPDATING') {
            this._throwError("Une mise à jour est déjà en cours pour ce bot.", ErrorCodes.BAD_REQUEST);
        }

        bot.updateStatus = 'UPDATING';
        bot.lastErrorMessage = null;
        await bot.save();

        this._processUpdate(bot).catch(err => {
            this._logError(`Crash process update bot ${bot._id}: ${err.message}`);
        });

        return { message: "Mise a jour du bot lance avec succès" };
    }

    async _processUpdate(bot) {
        try {
            this._logInfo(`Debut de la mise a jour pour le bot ${bot._id}`);

            const targetVersion = await this.#releaseDb.getLatestRelease()

            await this.#docker.pullImage(targetVersion);

            if (bot.containerId) {
                await this.#socket.emitStopAndWait(bot._id.toString(), true); 
                await this.#docker.destroyContainer(bot.containerId);
            }

            const tartarToken = this._generateToken(bot)

            const newContainerId = await this.#docker.createContainer({
                botId: bot._id.toString(),
                tartarToken: tartarToken,
                disToken: bot.token,
                version: targetVersion
            });

            await this.#docker.startContainer(newContainerId);

            bot.containerId = newContainerId;
            bot.updateStatus = 'IDLE';
            bot.version = targetVersion;
            await bot.save();

            this._logInfo(`Mise à jour réussie pour le bot ${bot._id}`);

        } catch (error) {
            this._logError(`Échec mise à jour bot ${bot._id}: ${error.message}`);
            
            bot.updateStatus = 'ERROR';
            bot.lastErrorMessage = error.message;
            await bot.save();
        }
    }

    _generateToken(bot){
        return jwt.sign(
            {
                orca_id: bot._id.toString(),
                created_at: Date.now(),
            },
            process.env.JWT_SECRET
        )
    }
}
module.exports = BotDeploymentService;