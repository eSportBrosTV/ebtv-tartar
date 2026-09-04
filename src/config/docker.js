const Docker = require("dockerode");

const env = process.env.ENVEX;

const docker = env === "prod"
    ? new Docker({
        host: process.env.DOCKER_REMOTE_IP,
        port: process.env.DOCKER_REMOTE_PORT,
      })
    : new Docker();

const connectDocker = async () => {
    try {
        await docker.ping();
        console.log("[Docker] Connexion reussi");
    } catch (err) {
        console.error("[Docker] Connexion impossible");
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = { docker, connectDocker };