const express = require("express");

const { injectCtx, authorize } = require("../../middlewares");
const { Orga } = require("../../models");

const orgaMembersRouter = require("./_orgId.members.routes");

const policies = require("../../policies");

const orgaCtrl = require("../../controllers/orgas/_orgId.controller")

const orgaRouter = express.Router({ mergeParams: true })

orgaRouter.use(
    injectCtx([
        {
            param: "orgId",
            model: Orga,
            key: "orga",
        }
    ]),
    authorize(policies.orga.isMember((req) => req.ctx.orga._id))
)

orgaRouter.get("/", orgaCtrl.getOrga);

orgaRouter.use("/members", orgaMembersRouter)

module.exports = orgaRouter