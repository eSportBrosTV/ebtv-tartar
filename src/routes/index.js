const express = require("express");

const authRouter = require("./auth/auth.routes");
const botsRouter = require("./bots/bots.routes");
const commandsRouter = require("./commands/commands.routes");
const orgasRouter = require("./orgas/orgas.routes");

const routes = express.Router()

routes.use("/auth", authRouter)
routes.use("/bots", botsRouter)
routes.use("/commands", commandsRouter)
routes.use("/orgas", orgasRouter)

module.exports = routes