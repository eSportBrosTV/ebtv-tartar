const express = require("express");

const orgaCtrl = require("../controllers/orga.controller");
const { orga } = require("../schemas");
const { Orga } = require("../models");

const membersRouter = require("./orga.members.routes");
const { auth, isAdmin, validateBody, verifExist, authorize } = require("../middlewares");
const policies = require("../policies");

const orgaRouter = express.Router();

orgaRouter.use(auth)

orgaRouter.post(
  "/",
  authorize(policies.admin.isAdmin),
  validateBody(orga.create),
  orgaCtrl.addOrga
);

orgaRouter.use("/:orgId", authorize(policies.or(policies.admin.isAdmin, policies.orga.isMember("orgId"))))
orgaRouter.get("/:orgId", orgaCtrl.getOrga);
orgaRouter.use("/:orgId/members", verifExist([
  {
    param: "orgId",
    model: Orga
  }
]), membersRouter)

module.exports = orgaRouter;
