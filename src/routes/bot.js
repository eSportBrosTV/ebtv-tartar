const express = require("express");

const botCtrl = require("../controllers/botCtrl");
const { commands, bot } = require("../schemas");
const validateBody = require("../middlewares/validateBody");
const setFilters = require("../middlewares/setFilters");
const setBodyParams = require("../middlewares/setBodyParams");
const inject = require("../middlewares/injectRessource");
const { Bot } = require("../models");
const verifExist = require("../middlewares/verifExist");
const auth = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");

const botRouter = express.Router();

botRouter.get("/", auth, isAdmin, botCtrl.getBots);
botRouter.get("/:idbot", setFilters({ _id: "idbot" }), botCtrl.getBot);

botRouter.post("/", validateBody(bot.create), botCtrl.addBot);
botRouter.post(
  "/:idbot/start",
  auth,
  isAdmin,
  inject([
    {
      model: Bot,
      param: "idbot",
      key: "bot"
    }
  ]),
  botCtrl.startBot
);

botRouter.post(
  "/:idbot/stop",
  auth,
  isAdmin,
  inject([
    {
      model: Bot,
      param: "idbot",
      key: "bot"
    }
  ]),
  botCtrl.stopBot
);

botRouter.delete(
  "/:idbot/kill",
  auth,
  isAdmin,
  inject([
    {
      model: Bot,
      param: "idbot",
      key: "bot"
    }
  ]),
  validateBody(bot.destroy),
  botCtrl.destroyBot
)

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
