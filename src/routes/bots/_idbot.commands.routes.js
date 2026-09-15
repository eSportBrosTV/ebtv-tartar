const express = require("express");

const { validateBody } = require("../../middlewares");

const botCommandRouter = require("./_idbot.commands._idbcommand.routes");

const schemas = require("../../schemas");

const botCommandsCtrl = require("../../controllers/bots/_idbot.commands.controller");

const botCommandsRouter = express.Router({ mergeParams: true })

botCommandsRouter.post("/", validateBody(schemas.bot.commandCreate), botCommandsCtrl.addCommand);
botCommandsRouter.get("/", botCommandsCtrl.getCommands)

botCommandsRouter.use("/:idbcommand", botCommandRouter)

module.exports = botCommandsRouter