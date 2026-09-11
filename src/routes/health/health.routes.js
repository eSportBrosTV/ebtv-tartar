const express = require('express')

const healthCtrl = require('../../controllers/health/health.controller')

const healthRouter = express.Router()

healthRouter.get("/", healthCtrl.getHealth)

module.exports = healthRouter