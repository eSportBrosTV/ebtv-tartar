const express = require('express')

const { user } = require('../../schemas')
const authCtrl = require('../../controllers/auth/auth.controller')
const passport = require('passport')

const { validateBody, auth, authorize } = require('../../middlewares')
const policies = require('../../policies')

const authRouter = express.Router()

authRouter.post("/login", validateBody(user.login), passport.authenticate('local'), authCtrl.login)
authRouter.post("/logout", auth, authCtrl.logout)

authRouter.get("/me", auth, authCtrl.me)

authRouter.post("/register", validateBody(user.create), auth, authorize(policies.admin.isAdmin), authCtrl.register)

module.exports = authRouter