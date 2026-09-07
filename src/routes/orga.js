const express = require('express')

const orgaCtrl = require("../controllers/orgaCtrl")
const validateBody = require('../middlewares/validateBody')
const { orga } = require('../schemas')
const isAdmin = require('../middlewares/isAdmin')
const auth = require('../middlewares/auth')
const uninmplemented = require('../middlewares/uninmplemented')

const orgaRouter = express.Router()

orgaRouter.post("/",auth, isAdmin, validateBody(orga.create), orgaCtrl.addOrga)
orgaRouter.get("/:id", auth, orgaCtrl.getOrga)

orgaRouter.get("/:orgId/members", uninmplemented)
orgaRouter.post("/:orgId/members", uninmplemented)

orgaRouter.get("/:orgaId/members/:memId", uninmplemented)
orgaRouter.delete("/:orgId/members/:memId", uninmplemented)
orgaRouter.patch("/:orgId/members/:memId", uninmplemented)

module.exports = orgaRouter