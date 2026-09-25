const { systemService } = require("../../../services");

module.exports = async (socket, next) => {
    if(!systemService.health.isHealthy){
        return next(new Error("Panne en cours TarTar est en mode securité"))
    }
    next();
}
