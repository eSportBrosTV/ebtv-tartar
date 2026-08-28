const { Bot } = require("../../models");
const { handleDeployementDone, handleConfigRequest } = require("./controllers/botEventsCtrl");
const { handleDisconect, setOnlineStatus } = require("./controllers/connectEventsCtrl");
const botAuthSocket = require("./middlewares/botAuthSocket");

module.exports = (io) => {
  io.use(botAuthSocket);

  io.on("connection", (socket) => {
    console.log(`[Socket] Bot connecté | Orca ID : ${socket.orcaId} | Socket ID : ${socket.id}`);

    socket.join(socket.orcaId);

    console.log(`[Socket] Bot connecte à la room : ${socket.orcaId}`);

    socket.on('deployment_done', () => handleDeployementDone(socket))
    socket.on('request_config', () => handleConfigRequest(socket))
    socket.on('disconnect', (reason) => handleDisconect(socket, reason))

    setOnlineStatus(socket.orcaId, true)
  });
};