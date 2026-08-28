const { Orga, Bot, Command, BotCommand } = require("../models");

const configGenerator = async (orcaId) => {
  const orcaBot = await Bot.findOne({ _id: orcaId });
  if (!orcaBot) throw new Error("Bot introuvable");

  const orga = await Orga.findOne({ _id: orcaBot.orga });
  if (!orga) throw new Error("Orga introuvable");

  const commandGlobal = await Command.find();
  const botConfigCommand = await BotCommand.find({ bot_id: orcaId });

  const commandList = [];
  const commandConfigured = {};
  for (const cmd of botConfigCommand) {
    commandConfigured[cmd.command_id] = cmd;
  }

  for (const command of commandGlobal) {
    if (!command.active) continue;

    let commandToPush = {
      id: command.internalID,
      metadata: {
        name: command.name,
        description: command.description,
        active: command.active,
        params: {},
      },
    };

    const configuredVersion = commandConfigured[command._id];

    if (!configuredVersion) {
      commandToPush.metadata.params = command.params;
    } else {
      commandToPush.metadata.params = {
        ...command.params,
        ...(configuredVersion.params || {}),
      };

      if (configuredVersion.active !== undefined) {
        commandToPush.metadata.active = configuredVersion.active;
      }
    }

    commandList.push(commandToPush);
  }

  return {
    id: orcaBot._id,
    orga: {
      id: orga._id,
      name: orga.orgaName,
    },
    serv: orcaBot.serv,
    logChannel: orcaBot.logChannel,
    requireFirstDeploy: orcaBot.requireFirstDeploy,
    commands: commandList,
  };
};

module.exports = {
  configGenerator,
};
