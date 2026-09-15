const express = require("express")

const { validateBody } = require("../../middlewares")

const schemas = require("../../schemas")

const meCtrl = require("../../controllers/users/me.controller")

const meRouter = express.Router()

meRouter.get("/", meCtrl.getMe)
meRouter.patch("/", validateBody(schemas.user.update.updateUser), meCtrl.updateMe)

module.exports = meRouter