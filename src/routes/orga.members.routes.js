const express = require("express");

const orgaCtrl = require("../controllers/orga.controller");
const { orga } = require("../schemas");

const { isAdmin, validateBody, unimplemented } = require("../middlewares");

const membersRouter = express.Router({ mergeParams: true });

membersRouter.get("/", orgaCtrl.getMembers);
membersRouter.post(
  "/",
  isAdmin,
  validateBody(orga.addMember),
  orgaCtrl.addMember
);

membersRouter.get("/:memId", unimplemented);
membersRouter.delete("/:memId", unimplemented);
membersRouter.patch("/:memId", unimplemented);

module.exports = membersRouter;
