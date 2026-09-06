const { docker } = require("../config/docker");

const env = process.env.ENVEX;

const dockerService = {
  async getContainers() {
    try {
      const containers = await docker.listContainers({
        all: true,
        filters: {
          name: ["bot_"],
        },
      });

      let finalContainers = [];

      for (let container of containers) {
        finalCOntainers.push(docker.getContainer(container.Id));
      }

      return finalContainers;
    } catch (err) {
      console.error("Erreur de recup des conteneur", err.message);
      return [];
    }
  },

  async createContainer({ tartarToken, disToken, botId}) {
    const imageToUse =
      env === "dev" ? "node:20-alpine" : process.env.BOT_IMAGE_PROD;
    const binds = env === "dev" ? [`${process.env.LOCAL_BOT_PATH}:/app`] : [];
    const cmd =
      env === "dev"
        ? ["sh", "-c", "npm install && node src/server.js"]
        : undefined;
    const managerURL =
      env === "prod"
        ? process.env.MANAGER_PUBLIC_URL
        : "http://host.docker.internal:3000";

    const container = await docker.createContainer({
      Image: imageToUse,
      name: `bot_${botId}`,
      Env: [
        `TARTAR_TOKEN=${tartarToken}`,
        `DIS_TOKEN=${disToken}`,
        `MANAGER_URL=${managerURL}`,
      ],
      HostConfig: { Binds: binds, Memory: 256 * 1024 * 1024 },
      WorkingDir: "/app",
      ...(cmd && { Cmd: cmd }),
    });

    return container.id;
  },

  async startContainer(containerId) {
    if (!containerId) throw new Error("ID du conteneur manquant");

    const container = docker.getContainer(containerId);
    const info = await container.inspect();

    if (!info.State.Running) {
      await container.start();
    }
    return true;
  },

  async stopContainer(containerId) {
    if (!containerId) return false;

    try {
      const container = docker.getContainer(containerId);
      await container.stop();
      return true;
    } catch (error) {
      if (error.statusCode === 304) return true;
      throw new Error(`Erreur Docker lors de l'arrêt : ${error.message}`);
    }
  },

  async destroyContainer(containerId) {
    if (!containerId) return false;

    try {
      const container = docker.getContainer(containerId);
      const info = await container.inspect();

      if (info.State.Running) await container.stop();
      await container.remove();

      return true;
    } catch (err) {
      console.error(
        `[Docker] Impossible de détruire ${containerId}:`,
        err.message
      );
      return false;
    }
  },

  async checkContainerExist(containerId) {
    if (!containerId) return false;

    try {
      const container = docker.getContainer(containerId);
      await container.inspect();
      return true;
    } catch (err) {
      if (err.statusCode === 404) {
        return false;
      }
      throw err;
    }
  },
};

module.exports = dockerService;
