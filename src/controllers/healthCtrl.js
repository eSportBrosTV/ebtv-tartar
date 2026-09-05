const healthMonitor = require("../services/healthMonitor")
const catchAsync = require("../utils/catchAsync")

const getHealth = catchAsync((req,res,next) => {
    const status = healthMonitor.isHealthy ? 200 : 503

    res.status(status).json({
        isHealthy: healthMonitor.isHealthy,
        services: healthMonitor.services,
        timestamp: new Date().toISOString()
    })
})

module.exports = {
    getHealth
}