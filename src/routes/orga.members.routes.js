const express = require("express");

const validateBody = require("../middlewares/validateBody");
const orgaCtrl = require("../controllers/orga.controller");
const uninmplemented = require("../middlewares/uninmplemented");

const membersRouter = express.Router({ mergeParams: true });

membersRouter.get("/", orgaCtrl.getMembers);
membersRouter.post(
  "/",
  isAdmin,
  validateBody(orga.addMember),
  orgaCtrl.addMember
);

membersRouter.get("/:memId", uninmplemented);
membersRouter.delete("/:memId", uninmplemented);
membersRouter.patch("/:memId", uninmplemented);

module.exports = membersRouter;
