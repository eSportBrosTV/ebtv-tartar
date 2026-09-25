const { botService } = require("../../../services");
const socketCatch = require("../../../utils/socketCatch");

const handleDeploymentDone = socketCatch(async (socket) => {
    console.log(`[Socket] Le bot ${socket.orcaId} a termine le premier deploiement de ses commandes`);

    await botService.deploy.markFirstDeployDone(socket.orcaId)
})

const handleConfigRequest = socketCatch(async (socket) => {
    console.log(`[Socket] Config demander par ${socket.orcaId}`);

    const config = await botService.config.generateConfig(socket.orcaId)

    socket.emit("update_config", config)
})

module.exports = {
    handleConfigRequest,
    handleDeploymentDone
}
