const { Bot, BotCommand } = require("../models");
const factory = require("../utils/crudFactory");
const catchAsync = require("../utils/catchAsync");
const { getIO } = require("../config/socket");
const { configGenerator } = require("../services/configGenerator");
const dockerService = require("../services/dockerService");
const AppError = require("../utils/appError");
const jwt = require("jsonwebtoken");
const ApiResponse = require("../utils/ApiResponse");

async function emitStopAndWait(botId, force = false) {
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
  const newBot = new Bot(req.body);

  const botJwt = jwt.sign(
    {
      orca_id: newBot.id,
      created_at: Date.now(),
    },
    process.env.JWT_SECRET
  );

  let newContainerId = await dockerService.createContainer({
    botId: newBot.id,
    tartarToken: botJwt,
    disToken: newBot.token,
  });

  newBot.containerId = newContainerId;

  await newBot.save();

  let isStarted = await dockerService.startContainer(newContainerId);

  if (isStarted) {
    ApiResponse.created(res, newBot, "Bot creer et demarer");
  } else {
    const response = new ApiResponse(
      res,
      201,
      newBot,
      "Bot creer mais non demarer"
    );
    response.payload.status = "partial";

    response.send();
  }
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

  ApiResponse.created(res, newCommandBot);
});

const updateBotCommand = catchAsync(async (req, res, next) => {});

const startBot = catchAsync(async (req, res, next) => {
  const containerId = req.bot.containerId;

  if (!(await dockerService.checkContainerExist(containerId))) {
    throw new AppError(`Le conteneur du bot ${bot.id} n'existe pas`, 404);
  }

  if (!(await dockerService.startContainer(containerId))) {
    throw new AppError(`Impossible de demarer le bot`, 500);
  }

  ApiResponse.ok(res, null, "Bot demarer");
});

const stopBot = catchAsync(async (req, res, next) => {
  const bot = req.bot;

  await emitStopAndWait(bot.id);

  if (!(await dockerService.stopContainer(bot.containerId))) {
    throw new AppError(`Arret impossible`, 500);
  }

  ApiResponse.ok(res, null, "Bot stopper");
});

const destroyBot = catchAsync(async (req, res, next) => {
  const bot = req.bot;

  await emitStopAndWait(bot.id, req.body.force);

  if (!(await dockerService.destroyContainer(bot.containerId))) {
    throw new AppError("Impossible de detruir le conteneur du bot", 500);
  }

  await bot.deleteOne();

  ApiResponse.ok(res, null, "Bot supprimer avec succer")
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
