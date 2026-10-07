const BaseDomainService = require('../../core/BaseDomainService');
const ErrorCodes = require('../../../utils/errors/ErrorCodes');
const BotDataService = require('../../data/BotDataService');
const OrgaDataService = require('../../data/OrgaDataService');
const BotCommandDataService = require('../../data/BotCommandDataService');
const DataService = require('../../core/DataService');
const { resolve } = require('../../../utils/commandParams');
const zodErrorDetails = require('../../../utils/errors/zodErrorDetails');
const { getPlatform } = require('../../../platforms');

class BotConfigService extends BaseDomainService {
    #botDb
    #orgaDb
    #commandDb
    #botCommandDb
    /**
     * @param {BotDataService} botData
     * @param {OrgaDataService} orgaData
     * @param {DataService} commandData
     * @param {BotCommandDataService} botCommandData
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
        this._logInfo(`Generation de la configuration pour le bot ${bot._id}`);

        const orga = await this.#orgaDb.findById(bot.orga);
        if (!orga) this._throwError("Orga introuvable", ErrorCodes.NOT_FOUND);

        const [states, platformState] = await Promise.all([
            this.#computeCommandStates(bot),
            this.#computePlatformState(bot)
        ]);

        return {
            id: bot._id,
            orga: {
                id: orga._id,
                name: orga.orgaName,
            },
            serv: bot.serv,
            logChannel: bot.logChannel,
            requireFirstDeploy: bot.requireFirstDeploy,
            commands: states.map(({ command, resolved }) => ({
                id: command.internalID,
                metadata: {
                    name: command.name,
                    description: command.description,
                    active: resolved.active,
                    params: resolved.params,
                },
            })),
            tournament: this.#toTournament(platformState),
        };
    }

    async getPlatformChoice(botOrId) {
        const bot = await this._resolveDocument(this.#botDb, botOrId);
        const state = await this.#computePlatformState(bot);

        if (!state) {
            return { platformId: null, params: {}, secretsSet: [] };
        }

        const { choice, secretKeys, errors } = state;

        return {
            platformId: choice.id,
            params: Object.fromEntries(Object.entries(choice.params ?? {}).filter(([key]) => !secretKeys.has(key))),
            secretsSet: Object.keys(choice.secrets ?? {}).filter((key) => secretKeys.has(key)),
            ...(errors.length > 0 && { errors }),
        };
    }

    #toTournament(state) {
        if (!state?.values) return null;

        const { choice, secretKeys, values } = state;
        const entries = Object.entries(values);

        return {
            provider: choice.id,
            params: Object.fromEntries(entries.filter(([key]) => !secretKeys.has(key))),
            secrets: Object.fromEntries(entries.filter(([key]) => secretKeys.has(key))),
        };
    }

    async #computePlatformState(bot) {
        const stored = await this.#botDb.findById(bot._id, '+platform.secrets');
        const choice = stored?.platform;

        if (!choice?.id) return null;

        const platform = getPlatform(choice.id);

        if (!platform) {
            return {
                choice,
                secretKeys: new Set(),
                values: null,
                errors: [{ path: 'platformId', message: `Plateforme inconnue : ${choice.id}` }],
            };
        }

        const result = platform.schema.safeParse({ ...choice.params, ...choice.secrets });

        return {
            choice,
            secretKeys: platform.secretKeys,
            values: result.success ? result.data : null,
            errors: result.success ? [] : zodErrorDetails(result.error),
        };
    }

    async getCommandsOverview(botOrId) {
        const bot = await this._resolveDocument(this.#botDb, botOrId);
        const states = await this.#computeCommandStates(bot);

        return states.map(({ command, botCommand, resolved, missing, invalid }) => ({
            commandId: command._id,
            botCommand: botCommand && {
                _id: botCommand._id,
                active: botCommand.active,
                params: botCommand.params,
            },
            resolved,
            missing,
            invalid,
        }));
    }

    async #computeCommandStates(bot) {
        const [commands, botCommands] = await Promise.all([
            this.#commandDb.find({ active: true }),
            this.#botCommandDb.findCommandsByBot(bot._id)
        ]);

        const botCommandByCommand = new Map(botCommands.map((botCommand) => [String(botCommand.command_id), botCommand]));

        return commands.map((command) => {
            const botCommand = botCommandByCommand.get(String(command._id)) ?? null;
            const { values, missing, invalid } = resolve(command.paramDefs, botCommand?.params);

            return {
                command,
                botCommand,
                resolved: {
                    active: (botCommand?.active ?? true) && missing.length === 0,
                    params: values,
                },
                missing,
                invalid,
            };
        });
    }
}

module.exports = BotConfigService;
