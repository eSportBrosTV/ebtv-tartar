const express = require("express");

const { authorize, validateBody, auth } = require("../../middlewares");

const orgaRouter = require("./_orgId.routes");

const policies = require("../../policies");
const schemas = require("../../schemas");

const orgasCtrl = require("../../controllers/orgas/orgas.controller");

const orgasRouter = express.Router();

orgasRouter.use(auth)

orgasRouter.post(
  "/",
  authorize(policies.admin.isAdmin),
  validateBody(schemas.orga.create),
  orgasCtrl.addOrga
);

orgasRouter.use("/:orgId", orgaRouter)

module.exports = orgasRouter;