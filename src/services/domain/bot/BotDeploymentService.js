// services/Domain/Bot/BotDeploymentService.js
const ErrorCodes = require('../../../utils/errors/ErrorCodes');
const BaseDomainService = require('../../core/BaseDomainService');


const DataService = require('../../core/DataService');
const DockerProvider = require('../../providers/DockerProvider');
const SocketProvider = require('../../providers/SocketProvider');
const ReleaseDataService = require('../../data/ReleaseDataService');
const BotAuthService = require('./BotAuthService');

class BotDeploymentService extends BaseDomainService {
    #db
    #docker
    #socket
    #releaseDb
    #auth
    /**
     *
     * @param {DataService} botData
     * @param {ReleaseDataService} releaseData
     * @param {BotAuthService} botAuth
     * @param {DockerProvider} dockerProvider
     * @param {SocketProvider} socketProvider
     */
    constructor(botData, releaseData, botAuth, dockerProvider, socketProvider) {

        super('BotDeployment');
        this.#db = botData;
        this.#releaseDb = releaseData
        this.#auth = botAuth
        this.#docker = dockerProvider;
        this.#socket = socketProvider;
    }

    async deployBot(botOrId, withStart = false) {
        const bot = await this._resolveDocument(this.#db, botOrId)

        const targetVersion = await this.#releaseDb.getLatestRelease()

        const tartarToken = this.#auth.generateToken(bot)

        await this.#docker.destroyBotContainer(bot._id)

        const containerId = await this.#docker.createContainer({
            botId: bot._id.toString(),
            tartarToken: tartarToken,
            disToken: bot.token,
            version: targetVersion
        })

        const deployedBot = await this.#db.updateById(bot._id, {
            containerId: containerId,
            version: targetVersion
        })

        if(withStart){
            await this.#docker.startContainer(containerId)
        }

        return deployedBot
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

    async destroyContainer(botOrId, force = false) {
        const bot = await this._resolveDocument(this.#db, botOrId);

        await this.#socket.emitStopAndWait(bot._id.toString(), force);
        await this.#docker.destroyContainer(bot.containerId);

        return await this.#db.updateById(bot._id, {
            containerId: null,
            isOnline: false
        });
    }

    async updateBot(botOrId) {
        const bot = await this._resolveDocument(this.#db, botOrId);

        if (bot.updateStatus === 'UPDATING') {
            this._throwError("Une mise à jour est déjà en cours pour ce bot.", ErrorCodes.BAD_REQUEST);
        }

        const targetVersion = await this.#releaseDb.getLatestRelease()

        await this.#db.updateById(bot._id, {
            updateStatus: 'UPDATING',
            lastErrorMessage: null,
            targetVersion: targetVersion
        });

        this.#launchUpdate(bot, targetVersion);

        return { message: "Mise a jour du bot lance avec succès" };
    }

    async recoverInterruptedUpdates() {
        const interruptedBots = await this.#db.find({ updateStatus: 'UPDATING' });

        for (const bot of interruptedBots) {
            await this.#recoverUpdate(bot);
        }

        return interruptedBots.length;
    }

    async #recoverUpdate(bot) {
        try {
            const targetVersion = bot.targetVersion || await this.#releaseDb.getLatestRelease();
            const container = await this.#docker.inspectBotContainer(bot._id);

            if (container?.running && container.version === targetVersion) {
                await this.#db.updateById(bot._id, {
                    containerId: container.id,
                    version: targetVersion,
                    updateStatus: 'IDLE',
                    targetVersion: null
                });

                this._logInfo(`Mise a jour du bot ${bot._id} deja terminee, statut synchronise`);
                return;
            }

            this._logInfo(`Reprise de la mise a jour interrompue du bot ${bot._id} vers ${targetVersion}`);
            this.#launchUpdate(bot, targetVersion);

        } catch (error) {
            this._logError(`Impossible de reprendre la mise a jour du bot ${bot._id}: ${error.message}`);

            await this.#db.updateById(bot._id, {
                updateStatus: 'ERROR',
                lastErrorMessage: error.message
            });
        }
    }

    #launchUpdate(bot, targetVersion) {
        this.#processUpdate(bot, targetVersion).catch(err => {
            this._logError(`Crash process update bot ${bot._id}: ${err.message}`);
        });
    }

    async #processUpdate(bot, targetVersion) {
        try {
            this._logInfo(`Debut de la mise a jour vers ${targetVersion} pour le bot ${bot._id}`);

            await this.#docker.pullImage(targetVersion);

            await this.#socket.emitStopAndWait(bot._id.toString(), true);
            await this.#docker.destroyBotContainer(bot._id);
            await this.#db.updateById(bot._id, { containerId: null });

            const tartarToken = this.#auth.generateToken(bot)

            const newContainerId = await this.#docker.createContainer({
                botId: bot._id.toString(),
                tartarToken: tartarToken,
                disToken: bot.token,
                version: targetVersion
            });

            await this.#db.updateById(bot._id, {
                containerId: newContainerId,
                version: targetVersion
            });

            await this.#docker.startContainer(newContainerId);

            await this.#db.updateById(bot._id, {
                updateStatus: 'IDLE',
                targetVersion: null
            });

            this._logInfo(`Mise à jour réussie pour le bot ${bot._id}`);

        } catch (error) {
            this._logError(`Échec mise à jour bot ${bot._id}: ${error.message}`);

            await this.#db.updateById(bot._id, {
                updateStatus: 'ERROR',
                lastErrorMessage: error.message
            });
        }
    }

    async markFirstDeployDone(botId) {
        await this.#db.updateById(botId, { requireFirstDeploy: false });
    }
}
module.exports = BotDeploymentService;
