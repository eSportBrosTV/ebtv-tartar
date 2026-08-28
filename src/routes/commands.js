const express = require('express')

const commandsCtrl = require("../controllers/commandsCtrl")
const { commands } = require('../schemas')
const validateBody = require('../middlewares/validateBody')

const commandsRouter = express.Router()

commandsRouter.get("/:id", commandsCtrl.getCommand)
commandsRouter.post("/", validateBody(commands.create), commandsCtrl.addCommand)

module.exports = commandsRouter