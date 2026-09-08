const express = require("express");

const botCtrl = require("../controllers/bot.controller");
const { commands, bot } = require("../schemas");
const { Bot } = require("../models");

const {
  auth,
  isAdmin,
  setFilters,
  validateBody,
  injectRessource,
  verifExist,
  setBodyParams,
} = require("../middlewares");

const botRouter = express.Router();

botRouter.get("/", auth, isAdmin, botCtrl.getBots);
botRouter.get("/:idbot", auth, setFilters({ _id: "idbot" }), botCtrl.getBot);

botRouter.post("/", auth, isAdmin, validateBody(bot.create), botCtrl.addBot);

botRouter.post(
  "/:idbot/start",
  auth,
  isAdmin,
  injectRessource([
    {
      model: Bot,
      param: "idbot",
      key: "bot",
    },
  ]),
  botCtrl.startBot
);

botRouter.post(
  "/:idbot/stop",
  auth,
  isAdmin,
  injectRessource([
    {
      model: Bot,
      param: "idbot",
      key: "bot",
    },
  ]),
  botCtrl.stopBot
);

botRouter.delete(
  "/:idbot/kill",
  auth,
  isAdmin,
  injectRessource([
    {
      model: Bot,
      param: "idbot",
      key: "bot",
    },
  ]),
  validateBody(bot.destroy),
  botCtrl.destroyBot
);

botRouter.post(
  "/:idbot/command",
  verifExist([
    {
      model: Bot,
      param: "idbot",
    },
  ]),
  setBodyParams({ bot_id: "idbot" }),
  validateBody(bot.commandCreate),
  botCtrl.addCommandToBot
);

module.exports = botRouter;
