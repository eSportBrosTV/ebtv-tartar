const { handleDeploymentDone, handleConfigRequest } = require("./controllers/botEventsCtrl");
const { handleConnect, handleDisconnect } = require("./controllers/connectEventsCtrl");
const botAuthSocket = require("./middlewares/botAuthSocket");
const isHealthConnect = require("../common/middlewares/isHealthConnect");

module.exports = (io) => {
  io.use(isHealthConnect)
  io.use(botAuthSocket);

  io.on("connection", (socket) => {
    socket.join(socket.orcaId);

    socket.on('deployment_done', () => handleDeploymentDone(socket))
    socket.on('request_config', () => handleConfigRequest(socket))
    socket.on('disconnect', (reason) => handleDisconnect(socket, reason))

    handleConnect(socket)
  });
};
