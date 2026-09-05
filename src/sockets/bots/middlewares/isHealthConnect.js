const healthMonitor = require("../../../services/healthMonitor");

module.exports = async (socket, next) => {
    if(!healthMonitor.isHealthy){
        return next(new Error("Panne en cours TarTar est en mode securité"))
    }
    next(); 
}