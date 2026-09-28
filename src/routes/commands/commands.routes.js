const express = require('express')

const { auth, authorize, validateBody } = require('../../middlewares')

const commandRouter = require('./_idCommand.routes')

const schemas = require('../../schemas')
const policies = require('../../policies')

const commandsCtrl = require("../../controllers/commands/commands.controller")

const commandsRouter = express.Router()

commandsRouter.use(auth)

commandsRouter.get("/", commandsCtrl.getCommands)
commandsRouter.post("/", authorize(policies.admin.isAdmin), validateBody(schemas.commands.create), commandsCtrl.addCommand)

commandsRouter.use("/:idCommand", commandRouter)

module.exports = commandsRouter