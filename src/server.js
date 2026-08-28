require("dotenv").config();
const http = require("http");
const { Bot } = require("./models");

const PORT = process.env.PORT || 3000;

const app = require("./config/app");
const socket = require("./config/socket");
const { connectDB } = require("./config/db");

const shutdownProccess = require("./utils/shutdownProccess");

const server = http.createServer(app);

process.on("SIGTERM", shutdownProccess);
process.on("SIGINT", shutdownProccess);

const startApp = async () => {
  try {
    await connectDB();

    socket.init(server);

    await Bot.updateMany({}, { isOnline: false });
    console.log("[Server] Statut des bot initialiser");

    server.listen(PORT, () => {
      console.log("[Server] Tartar est en ligne");
    });
  } catch (error) {
    console.error("[Server] Erreur au demarage", error)
    process.exit(1)
  }
};

startApp();
