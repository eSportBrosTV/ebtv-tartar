const express = require('express')

const orgaCtrl = require("../controllers/orgaCtrl")
const validateBody = require('../middlewares/validateBody')
const { orga } = require('../schemas')

const orgaRouter = express.Router()

orgaRouter.post("/", validateBody(orga.create), orgaCtrl.addOrga)
orgaRouter.get("/:id", orgaCtrl.getOrga)

module.exports = orgaRouter