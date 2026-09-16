const express = require("express")

const commandCtrl = require("../../controllers/commands/_idCommand.controller")
const { injectCtx, validateBody } = require("../../middlewares")
const { Command } = require("../../models")
const schemas = require("../../schemas")

const commandRouter = express.Router({mergeParams: true})

commandRouter.use(
    injectCtx([
        {
            model: Command,
            param: "idCommand",
            key: "command"
        }
    ])
)

commandRouter.get("/", commandCtrl.getCommand)
commandRouter.patch("/", validateBody(schemas.commands.update), commandCtrl.updateCommand)
commandRouter.delete("/", commandCtrl.deleteCommand)

module.exports = commandRouter