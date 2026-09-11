const express = require("express");

const { authorize, validateBody } = require("../../middlewares");

const orgaMemberRouter = require("./_orgId.members._memId.routes");

const policies = require("../../policies");
const schemas = require("../../schemas");

const orgaMembersCtrl = require("../../controllers/orgas/_orgId.members.controller.js");

const orgaMembersRouter = express.Router({mergeParams: true})

orgaMembersRouter.get("/", orgaMembersCtrl.getMembers);
orgaMembersRouter.post("/", authorize(policies.orga.hasRole(["owner"])), validateBody(schemas.orga.addMember), orgaMembersCtrl.addMember);

orgaMembersRouter.use("/:memId", orgaMemberRouter)

module.exports = orgaMembersRouter