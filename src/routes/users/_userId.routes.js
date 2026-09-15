const express = require('express')

const { authorize, injectCtx, validateBody } = require('../../middlewares')
const { User } = require('../../models')

const policies = require('../../policies')
const schemas = require('../../schemas')

const userCtrl = require("../../controllers/users/_userId.controller")

const userRouter = express.Router({ mergeParams: true })

userRouter.use(
    authorize(policies.admin.isAdmin),
    injectCtx([
        {
            model: User,
            param: "userId",
            key: "user"
        }
    ])
)

userRouter.get("/", userCtrl.getUser)
userRouter.patch("/", validateBody(schemas.user.update.updateAdmin), userCtrl.updateUser)
userRouter.delete("/", userCtrl.deleteUser)

module.exports = userRouter