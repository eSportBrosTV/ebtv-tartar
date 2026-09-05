const { sendDiscordAlert } = require("../services/discordService");
const { getIO } = require("../config/socket");

module.exports = async ({ isHealthy, services, failedList }) => {
  // 1. SI TOUT VA BIEN
  if (isHealthy) {
    console.log("✅ [HealthMonitor] Système de nouveau 100% opérationnel.");
    await sendDiscordAlert({
      isHealthy: true,
      title: "✅ Système Rétabli",
      description:
        "Tous les services (DB, WebSocket, Docker) refonctionnent normalement.",
      services,
    });
    return;
  }

  console.error(
    `[Health] Services defaillants : [${failedList.join(", ")}]`
  );

  try {
    const io = getIO();

    if(io){
        io.disconnectSockets(true)
        console.warn("[Health] Tout les socket ont eter couper")
    }
  } catch (err){
    console.error(err)
  }

  await sendDiscordAlert({
    isHealthy: false,
    title: "Panne détectée",
    description: `Mise en securité de TarTar les route API ont etait bloquer et les socket fermer`,
    services: services,
    color: 15158332,
  });
};
