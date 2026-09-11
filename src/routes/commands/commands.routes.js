const express = require('express')

const commandsCtrl = require("../../controllers/commands/commands.controller")
const { commands } = require('../../schemas')

const { auth, validateBody, isAdmin } = require('../../middlewares')

const commandsRouter = express.Router()

commandsRouter.get("/:id", commandsCtrl.getCommand)
commandsRouter.post("/", auth, isAdmin, validateBody(commands.create), commandsCtrl.addCommand)

module.exports = commandsRouter