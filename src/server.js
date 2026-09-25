require("dotenv").config();
const http = require("http");

const PORT = process.env.PORT || 3000;

const app = require("./config/app");
const socket = require("./config/socket");
const { connectDB } = require("./config/db");
const { connectDocker } = require("./config/docker");

const shutdownProccess = require("./utils/shutdownProccess");
const { botService, releaseService, systemService } = require("./services");

const server = http.createServer(app);

process.on("SIGTERM", shutdownProccess);
process.on("SIGINT", shutdownProccess);

const startApp = async () => {
  try {
    await connectDB();

    await connectDocker();

    socket.init(server);

    await botService.presence.resetAll();
    console.log("[Server] Statut des bot initialiser");

    await releaseService.syncCatalog()

    systemService.health.start()
    console.log("[Server] Monitoring lancer")

    server.listen(PORT, () => {
      console.log("[Server] Tartar est en ligne");
    });
  } catch (error) {
    console.error("[Server] Erreur au demarage", error);
    process.exit(1);
  }
};

startApp();
