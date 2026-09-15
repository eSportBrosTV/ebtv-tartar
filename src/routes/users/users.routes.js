const express = require('express')

const { auth, authorize } = require('../../middlewares')

const meRouter = require('./me.routes')
const userRouter = require('./_userId.routes')

const policies = require('../../policies')

const usersCtrl = require("../../controllers/users/users.controller")

const usersRouter = express.Router()

usersRouter.use(auth)

usersRouter.get("/", authorize(policies.admin.isAdmin), usersCtrl.getAllUsers)

usersRouter.use("/me", meRouter)
usersRouter.use("/:userId", userRouter)

module.exports = usersRouter