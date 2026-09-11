const express = require("express");

const { injectCtx, authorize, validateBody } = require("../../middlewares");
const { AssoMember } = require("../../models");

const schemas = require("../../schemas");
const policies = require("../../policies");

const orgaMemberCtrl = require("../../controllers/orgas/_orgId.members._memId.controller");

const orgaMemberRouter = express.Router({mergeParams: true})

orgaMemberRouter.use(
    injectCtx([
        {
            param: "memId",
            model: AssoMember,
            key: "orgaMember"
        }
    ]),
    authorize(policies.hierarchy.isChildOf((req) => req.ctx.orga._id, (req) => req.ctx.orgaMember.orga))
)

orgaMemberRouter.get("/", orgaMemberCtrl.getMember)

orgaMemberRouter.delete("/", authorize(policies.orga.hasRole(["owner"])), orgaMemberCtrl.deleteMember)
orgaMemberRouter.patch("/", authorize(policies.orga.hasRole(["owner"])),validateBody(schemas.orga.updateMember), orgaMemberCtrl.updateMember);

module.exports = orgaMemberRouter