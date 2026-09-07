const express = require("express");

const orgaCtrl = require("../controllers/orgaCtrl");
const validateBody = require("../middlewares/validateBody");
const { orga } = require("../schemas");
const isAdmin = require("../middlewares/isAdmin");
const auth = require("../middlewares/auth");
const uninmplemented = require("../middlewares/uninmplemented");
const verifExist = require("../middlewares/verifExist");
const { Orga } = require("../models");
const membersRouter = require("./orga.members.routes");

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
