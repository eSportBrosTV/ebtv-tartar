const express = require('express')

const { injectCtx, validateBody, authorize } = require('../../middlewares')
const { BotCommand } = require('../../models')

const schemas = require('../../schemas')
const policies = require('../../policies')

const botCommandCtrl = require("../../controllers/bots/_idbot.commands._idbcommand.controller")

const botCommandRouter = express.Router({mergeParams: true})

botCommandRouter.use(
    injectCtx([
        {
            model: BotCommand,
            param: "idbcommand",
            key: "botCommand"
        }
    ]),
    authorize(policies.hierarchy.isChildOf((req) => req.ctx.bot._id, (req) => req.ctx.botCommand.bot_id))
)

botCommandRouter.get("/", botCommandCtrl.getCommand)
botCommandRouter.patch("/", validateBody(schemas.bot.commandUpdate), botCommandCtrl.updateCommand)
botCommandRouter.delete("/", botCommandCtrl.deleteCommand)

module.exports = botCommandRouter