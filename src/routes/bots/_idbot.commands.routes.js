const express = require("express");

const { setBodyParams, validateBody } = require("../../middlewares");

const schemas = require("../../schemas");

const botCommandsCtrl = require("../../controllers/bots/_idbot.commands.controller");

const botCommandsRouter = express.Router({ mergeParams: true })

botCommandsRouter.post(
  "/",
  setBodyParams({ bot_id: "idbot" }),
  validateBody(schemas.bot.commandCreate),
  botCommandsCtrl.addCommand
);

module.exports = botCommandsRouter