const BaseDomainService = require("../../core/BaseDomainService");
const BotDeploymentService = require("./BotDeploymentService");
const BotManagementService = require("./BotManagementService");

class BotLifecycleService extends BaseDomainService {
    #manage
    #deploy
    /**
     * @param {BotManagementService} botManagement
     * @param {BotDeploymentService} botDeployment
     */
    constructor(botManagement, botDeployment){
        super('BotLifecycle')
        this.#manage = botManagement
        this.#deploy = botDeployment
    }

    async create(payload){
        const newBot = await this.#manage.create(payload)

        try {
            const deployedBot = await this.#deploy.deployBot(newBot, true)

            return { bot: deployedBot, deployed: true }
        } catch (err) {
            this._logError(`Bot ${newBot._id} creer mais non deployer : ${err.message}`)

            return { bot: newBot, deployed: false }
        }
    }

    async destroy(botOrId, force = false){
        const bot = await this.#deploy.destroyContainer(botOrId, force)

        await this.#manage.delete(bot._id)
    }
}

module.exports = BotLifecycleService
