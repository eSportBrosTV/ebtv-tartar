const express = require("express");

const authRouter = require("./auth.routes");
const botRouter = require("./bot.routes");
const commandsRouter = require("./commands.routes");
const orgaRouter = require("./orga.routes");

const routes = express.Router()

routes.use("/auth", authRouter)
routes.use("/bots", botRouter)
routes.use("/commands", commandsRouter)
routes.use("/orgas", orgaRouter)

module.exports = routes