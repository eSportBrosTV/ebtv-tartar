const express = require("express")

const commandCtrl = require("../../controllers/commands/_idCommand.controller")
const { injectCtx, validateBody, authorize } = require("../../middlewares")
const { Command } = require("../../models")
const schemas = require("../../schemas")
const policies = require("../../policies")

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
commandRouter.patch("/", authorize(policies.admin.isAdmin), validateBody(schemas.commands.update), commandCtrl.updateCommand)
commandRouter.delete("/", authorize(policies.admin.isAdmin), commandCtrl.deleteCommand)

module.exports = commandRouter