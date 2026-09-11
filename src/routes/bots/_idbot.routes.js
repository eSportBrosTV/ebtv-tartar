const express = require("express");

const { validateBody, injectCtx, authorize } = require("../../middlewares");
const { Bot } = require("../../models");

const botCommandsRouter = require("./_idbot.commands.routes");

const schemas = require("../../schemas");
const policies = require("../../policies");

const botCtrl = require("../../controllers/bots/_idbot.controller");

const botRouter = express.Router({ mergeParams: true })

botRouter.use(
    injectCtx([
        {
            param: "idbot",
            model: Bot,
            key: "bot",
        }
    ]), authorize(policies.orga.isMember((req) => req.ctx.bot.orga)))

botRouter.get("/", botCtrl.getBot);

botRouter.post("/start", botCtrl.startBot);
botRouter.post("/stop", botCtrl.stopBot);
botRouter.post("/kill", authorize(policies.orga.hasRole(["owner"], (req) => req.ctx.bot.orga)), validateBody(schemas.bot.destroy), botCtrl.destroyBot);

botRouter.use("/commands", botCommandsRouter)

module.exports = botRouter