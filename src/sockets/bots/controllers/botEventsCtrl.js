const { Bot } = require("../../../models");
const { configGenerator } = require("../../../services/configGenerator");

const handleDeployementDone = async (socket) => {
  console.log(
    `[Socket] Le bot ${socket.orcaId} a termine le premier deploiement de ses commandes`
  );

  try {
    await Bot.findByIdAndUpdate(socket.orcaId, { requireFirstDeploy: false });
  } catch (error) {
    console.error("Erreur lors du retrait de flag");
  }
};

const handleConfigRequest = async (socket) => {
  console.log(`[Socket] Config demander par ${socket.orcaId}`);
  try {
    const config = await configGenerator(socket.orcaId);
    socket.emit("update_config", config);
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
    handleConfigRequest,
    handleDeployementDone
}