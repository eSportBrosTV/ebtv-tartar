const healthMonitor = require("../../services/healthMonitor")
const AppError = require("../../utils/appError")

module.exports = (req,res,next) => {
    if(!healthMonitor.isHealthy){
        return next(new AppError("Panne en cours TarTar est en mode securité", 503))
    }

    next()
}