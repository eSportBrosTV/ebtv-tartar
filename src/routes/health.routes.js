const express = require('express')

const healthCtrl = require('../controllers/healthCtrl')

const healthRouter = express.Router()

healthRouter.get("/", healthCtrl.getHealth)

module.exports = healthRouter