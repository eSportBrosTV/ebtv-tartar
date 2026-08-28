const { Bot } = require("../../../models");

const setOnlineStatus = async (orcaId, isOnline) => {
    try {
        await Bot.findByIdAndUpdate(orcaId, { isOnline });
    } catch (error) {
        console.error(`[Socket] Erreur maj statut (isOnline: ${isOnline}) :`, error);
    }
}

const handleDisconect = async (socket, reason) => {
    console.log(
        `[Socket] Bot deconnecte | Orga ID : ${socket.orcaId} | Raison : ${reason}`
      );

    setOnlineStatus(socket.orcaId, false)
}

module.exports = {
    setOnlineStatus,
    handleDisconect
}