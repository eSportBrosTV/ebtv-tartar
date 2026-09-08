const express = require('express')

const { user } = require('../schemas')
const authCtrl = require('../controllers/auth.controller')
const passport = require('passport')

const { validateBody, auth } = require('../middlewares')

const authRouter = express.Router()

authRouter.post("/register", validateBody(user.create), auth, authCtrl.register)
authRouter.post("/login", validateBody(user.login), passport.authenticate('local'), authCtrl.login)

authRouter.post("/logout", auth, authCtrl.logout)
authRouter.get("/me", auth, authCtrl.me)

module.exports = authRouter