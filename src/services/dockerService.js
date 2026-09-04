const Docker = require("dockerode");
const { Bot } = require("../models");
const AppError = require("../utils/appError");

const env = process.env.ENVEX;

const docker =
  env === "prod"
    ? new Docker({
        host: process.env.DOCKER_REMOTE_IP,
        port: process.env.DOCKER_REMOTE_PORT,
      })
    : new Docker();

const dockerService = {
  async startBot(botId) {
    const bot = await Bot.findById(botId);
    if (!bot) throw new Error("Bot introuvable");

    const containerName = `bot_${botId}`;

    if (bot.containerId) {
      try {
        const container = docker.getContainer(bot.containerId);
        const info = await container.inspect();

        if (!info.State.Running) {
          await container.start();
        }
        return container.id;
      } catch (err) {
        console.log(`[Docker] Conteneur du bot ${botId} introuvable`);
      }
    }

    const imageToUse =
      env === "dev" ? "node:20-alpine" : process.env.BOT_IMAGE_PROD;

    const binds = env === "dev" ? [`${process.env.LOCAL_BOT_PATH}:/app`] : [];

    const cmd =
      env === "dev"
        ? ["sh", "-c", "npm install && npm node src/server.js"]
        : undefined;

    const managerURL =
      env === "prod"
        ? process.env.MANAGER_PUBLIC_URL
        : "http://host.docker.internal:3000";

    const container = await docker.createContainer({
      Image: imageToUse,
      name: containerName,
      Env: [
        `ORCA_ID=${botId}`,
        `ORG_ID=${bot.orga}`,
        `TOKEN=${bot.token}`,
        `MANAGER_URL=${managerURL}`,
      ],
      HostConfig: {
        Binds: binds,
        Memory: 256 * 1024 * 1024,
      },
      WorkingDir: "/app",
      ...(cmd && { Cmd: cmd }),
    });

    await container.start();

    bot.containerId = container.id;
    await bot.save();

    return container.id;
  },

  async stopBot(botId) {
    const bot = await Bot.findById(botId);
    if (!bot || !bot.containerId) {
      throw new AppError("Aucun bot ou conteneur attacher trouver", 404);
    }
    try {
      const container = docker.getContainer(bot.containerId);
      await container.stop();
      return "Bot arreter";
    } catch (error) {
      if (error.statusCode === 304) return "Bot deja arreter";
      throw error;
    }
  },

  async destroyBotContainer(botId) {
    const bot = await Bot.findById(botId);

    if (!bot || !bot.containerId) {
      throw new AppError("Aucun bot ou conteneur attacher trouver", 404);
    }

    try {
      const container = docker.getContainer(bot.containerId);
      if (!container) {
        throw new AppError("Conteneur inexistant", 404);
      }
      const info = await container.inspect();

      if (info.State.Running) await container.stop();

      await container.remove();
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  },
};

module.exports = dockerService;
