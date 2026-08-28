const { Bot, BotCommand } = require("../models");
const factory = require("../utils/crudFactory");
const catchAsync = require("../utils/catchAsync");
const { getIO } = require("../config/socket");
const { configGenerator } = require("../services/configGenerator");

const addBot = catchAsync(async (req, res, next) => {
  const newBot = await Bot.create(req.body);

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

const updateBotCommand = catchAsync(async (req, res, next) => {
    
});

module.exports = {
  getBots: factory.getAll(Bot),
  getBot: factory.getOne(Bot),
  addCommandToBot,
  addBot,
};
