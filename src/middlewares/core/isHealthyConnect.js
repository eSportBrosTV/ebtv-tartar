const { systemService } = require("../../services")
const AppError = require("../../utils/errors/appError")

module.exports = (req,res,next) => {
    if(!systemService.health.isHealthy){
        return next(new AppError("Panne en cours TarTar est en mode securité", 503))
    }

    next()
}
