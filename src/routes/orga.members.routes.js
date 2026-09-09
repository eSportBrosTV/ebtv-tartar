const express = require("express");

const memberCtrl = require("../controllers/orga.members.controller");

const { orga } = require("../schemas");

const {
  validateBody,
  verifExist,
  authorize,
} = require("../middlewares");

const AssoMember = require("../models/AssoMember");
const policies = require("../policies");
const schemas = require("../schemas");

const membersRouter = express.Router({ mergeParams: true });

membersRouter.get("/", memberCtrl.getMembers);
membersRouter.post(
  "/",
  authorize(policies.orga.hasRole(["owner"])),
  validateBody(orga.addMember),
  memberCtrl.addMember
);

membersRouter.use(
  "/:memId",
  verifExist([
    {
      param: "memId",
      model: AssoMember,
    },
  ])
);

const specMemRoute = membersRouter.route("/:memId")
specMemRoute.get(memberCtrl.getMember)
specMemRoute.delete(authorize(policies.orga.hasRole(["owner"])), memberCtrl.deleteMember)
specMemRoute.patch(authorize(policies.orga.hasRole(["owner"])),validateBody(schemas.orga.updateMember), memberCtrl.updateMember);

module.exports = membersRouter;
