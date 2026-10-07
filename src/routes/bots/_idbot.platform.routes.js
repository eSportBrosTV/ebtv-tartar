const express = require("express");

const { validateBody, authorize } = require("../../middlewares");

const schemas = require("../../schemas");
const policies = require("../../policies");

const botPlatformCtrl = require("../../controllers/bots/_idbot.platform.controller");

const botPlatformRouter = express.Router({ mergeParams: true })

botPlatformRouter.get("/", botPlatformCtrl.getPlatform)
botPlatformRouter.put("/", authorize(policies.orga.hasRole(["owner"], (req) => req.ctx.bot.orga)), validateBody(schemas.bot.platformUpdate), botPlatformCtrl.setPlatform)

module.exports = botPlatformRouter
