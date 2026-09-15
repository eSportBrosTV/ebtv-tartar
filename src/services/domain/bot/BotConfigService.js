const BaseDomainService = require('../../core/BaseDomainService');
const ErrorCodes = require('../../../utils/errors/ErrorCodes');
const BotDataService = require('../../data/BotDataService');
const OrgaDataService = require('../../data/OrgaDataService');
const DataService = require('../../core/DataService');

class BotConfigService extends BaseDomainService {
    #botDb
    #orgaDb
    #commandDb
    #botCommandDb
    /**
     * @param {BotDataService} botData 
     * @param {OrgaDataService} orgaData 
     * @param {DataService} commandData 
     * @param {DataService} botCommandData 
     */
    constructor(botData, orgaData, commandData, botCommandData) {
        super('BotConfig');
        this.#botDb = botData;
        this.#orgaDb = orgaData;
        this.#commandDb = commandData;
        this.#botCommandDb = botCommandData;
    }

    async generateConfig(botOrId) {
        const bot = await this._resolveDocument(this.#botDb, botOrId);
        console.log(bot)
        this._logInfo(`Generation de la configuration pour le bot ${bot._id}`);

        const orga = await this.#orgaDb.findById(bot.orga);
        if (!orga) this._throwError("Orga introuvable", ErrorCodes.NOT_FOUND);

        const [commandGlobal, botConfigCommand] = await Promise.all([
            this.#commandDb.find(),
            this.#botCommandDb.find({ bot_id: bot._id })
        ]);

        const commandConfigured = {};
        for (const cmd of botConfigCommand) {
            commandConfigured[cmd.command_id] = cmd;
        }

        const commandList = [];
        for (const command of commandGlobal) {
            if (!command.active) continue;

            let commandToPush = {
                id: command.internalID,
                metadata: {
                    name: command.name,
                    description: command.description,
                    active: command.active,
                    params: command.params || {},
                },
            };

            const configuredVersion = commandConfigured[command._id];

            if (configuredVersion) {
                commandToPush.metadata.params = {
                    ...commandToPush.metadata.params,
                    ...(configuredVersion.params || {}),
                };

                if (configuredVersion.active !== undefined) {
                    commandToPush.metadata.active = configuredVersion.active;
                }
            }

            commandList.push(commandToPush);
        }

        return {
            id: bot._id,
            orga: {
                id: orga._id,
                name: orga.orgaName,
            },
            serv: bot.serv,
            logChannel: bot.logChannel,
            requireFirstDeploy: bot.requireFirstDeploy,
            commands: commandList,
        };
    }
}

module.exports = BotConfigService;