const express = require('express')

const commandsCtrl = require("../controllers/command.controller")
const { commands } = require('../schemas')
const validateBody = require('../middlewares/validateBody')
const auth = require('../middlewares/auth')
const isAdmin = require('../middlewares/isAdmin')

const commandsRouter = express.Router()

commandsRouter.get("/:id", commandsCtrl.getCommand)
commandsRouter.post("/", auth, isAdmin, validateBody(commands.create), commandsCtrl.addCommand)

module.exports = commandsRouter