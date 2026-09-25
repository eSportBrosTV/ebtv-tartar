const { botService } = require("../../../services");
const socketCatch = require("../../../utils/socketCatch");

const handleConnect = socketCatch(async (socket) => {
    console.log(`[Socket] Bot connecte | Orca ID : ${socket.orcaId} | Socket ID : ${socket.id}`);

    await botService.presence.markOnline(socket.orcaId)
})

const handleDisconnect = socketCatch(async (socket, reason) => {
    console.log(`[Socket] Bot deconnecte | Orca ID : ${socket.orcaId} | Raison : ${reason}`);

    await botService.presence.markOffline(socket.orcaId)
})

module.exports = {
    handleConnect,
    handleDisconnect
}
