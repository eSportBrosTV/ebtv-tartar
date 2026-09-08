const express = require("express");

const orgaCtrl = require("../controllers/orga.controller");
const { orga } = require("../schemas");
const { Orga } = require("../models");

const membersRouter = require("./orga.members.routes");
const { auth, isAdmin, validateBody, verifExist } = require("../middlewares");

const orgaRouter = express.Router();

orgaRouter.post(
  "/",
  auth,
  isAdmin,
  validateBody(orga.create),
  orgaCtrl.addOrga
);
orgaRouter.get("/:id", auth, orgaCtrl.getOrga);

orgaRouter.use("/:orgId/members", auth, verifExist([
  {
    param: "orgId",
    model: Orga
  }
]), membersRouter)

module.exports = orgaRouter;
