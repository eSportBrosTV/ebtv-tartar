const express = require('express')

const { auth, authorize, validateBody } = require('../../middlewares')

const commandRouter = require('./_idCommand.routes')

const schemas = require('../../schemas')
const policies = require('../../policies')

const commandsCtrl = require("../../controllers/commands/commands.controller")

const commandsRouter = express.Router()

commandsRouter.use(auth, authorize(policies.admin.isAdmin))

commandsRouter.get("/", commandsCtrl.getCommands)
commandsRouter.post("/", validateBody(schemas.commands.create), commandsCtrl.addCommand)

commandsRouter.use("/:idCommand", commandRouter)

module.exports = commandsRouter