const { Bot, BotCommand } = require("../models");
const factory = require("../utils/crudFactory");
const catchAsync = require("../utils/catchAsync");
const { getIO } = require("../config/socket");
const { configGenerator } = require("../services/configGenerator");
const dockerService = require("../services/dockerService");
const AppError = require("../utils/appError");

async function emitStopAndWait(botId, force=false) {
  let botRep = null;

  try {
    const rep = await getIO()
      .of("/bots")
      .timeout(5000)
      .to(botId)
      .emitWithAck("stop");

    botRep = rep[0];
  } catch (err) {
    console.error(err);
    if (!force) {
      throw new AppError("Le bot ne repond pas", 504);
    }
  }

  if (botRep && !botRep.success && !force) {
    throw new AppError("Le bot n'as pas reussi a s'arreter", 502);
  }
}

const addBot = catchAsync(async (req, res, next) => {
  const newBot = await Bot.create(req.body);

  let container = await dockerService.startBot(newBot.id)

  newBot.containerId = container

  res.status(201).json({
    status: "success",
    data: newBot,
  });
});

const addCommandToBot = catchAsync(async (req, res, next) => {
  const orcaId = req.params.idbot;

  const newCommandBot = await BotCommand.findOneAndUpdate(
    {
      bot_id: orcaId,
      command_id: req.body.command_id,
    },
    req.body,
    {
      new: true,
      upsert: true,
    }
  );

  let newConf = await configGenerator(orcaId);

  getIO().of("/bots").to(orcaId).emit("update_config", newConf);

  res.status(201).json({
    status: "success",
    data: newCommandBot,
  });
});

const updateBotCommand = catchAsync(async (req, res, next) => {});

const startBot = catchAsync(async (req, res, next) => {
  const result = await dockerService.startBot(req.bot.id);

  res.status(200).json({
    status: "succes",
    data: {
      containerId: result,
    },
  });
});

const stopBot = catchAsync(async (req, res, next) => {
  const bot = req.bot;

  await emitStopAndWait(bot.id)

  const result = await dockerService.stopBot(req.bot.id);

  res.status(200).json({
    status: "success",
    message: result,
  });
});

const destroyBot = catchAsync(async (req, res, next) => {
  const bot = req.bot;

  await emitStopAndWait(bot.id, req.body.force)

  if (!(await dockerService.destroyBotContainer(bot.id))) {
    throw new AppError("Impossible de detruir le bot", 500);
  }

  await bot.deleteOne();

  res.status(200).json({
    status: "succes",
    message: "Bot supprimer avec succer",
  });
});

module.exports = {
  getBots: factory.getAll(Bot),
  getBot: factory.getOne(Bot),
  addCommandToBot,
  addBot,
  startBot,
  stopBot,
  destroyBot,
};
