const express = require("express");

const { auth, authorize, validateBody } = require("../../middlewares");

const singleBotRouter = require("./_idbot.routes");

const policies = require("../../policies");
const schemas = require("../../schemas");

const botsCtrl = require("../../controllers/bots/bots.controller");

const botsRouter = express.Router();

botsRouter.use(auth)

botsRouter.get("/", authorize(policies.admin.isAdmin), botsCtrl.getBots);
botsRouter.post("/", authorize(policies.admin.isAdmin), validateBody(schemas.bot.create), botsCtrl.addBot);

botsRouter.use("/:idbot", singleBotRouter)

module.exports = botsRouter;