// services/Providers/DockerProvider.js
const ProviderService = require('../core/ProviderService'); 
const { docker } = require('../../config/docker');
const ErrorCodes = require('../../utils/errors/ErrorCodes');

class DockerProvider extends ProviderService {
    #docker
    #env

    constructor() {
        super('DockerProvider');
        this.#docker = docker; 
        this.#env = process.env.ENVEX;
    }

    #getImageName(version){
        return `${process.env.BOT_IMAGE_PROD}:${version}`
    }

    async getContainers() {
        try {
            const containers = await this.#docker.listContainers({
                all: true,
                filters: { name: ["bot_"] },
            });

            return containers.map(container => this.#docker.getContainer(container.Id));
            
        } catch (err) {
            this._logInfo(`Erreur de recup des conteneurs: ${err.message}`);
            return [];
        }
    }

    async createContainer({ tartarToken, disToken, botId, version = 'latest' }) {
        try {
            const imageToUse = this.#env === "dev" ? "node:20-alpine" : this.#getImageName(version);
            const binds = this.#env === "dev" ? [`${process.env.LOCAL_BOT_PATH}:/app`] : [];
            const cmd = this.#env === "dev" ? ["sh", "-c", "npm install && node src/server.js"] : undefined;
            const managerURL = this.#env === "prod" ? process.env.MANAGER_PUBLIC_URL : "http://host.docker.internal:3000";

            this._logInfo(`Creation du conteneur bot_${botId}`);

            const container = await this.#docker.createContainer({
                Image: imageToUse,
                name: `bot_${botId}`,
                Env: [
                    `TARTAR_TOKEN=${tartarToken}`,
                    `DIS_TOKEN=${disToken}`,
                    `MANAGER_URL=${managerURL}`,
                    `BOT_VERSION=${version}`
                ],
                HostConfig: { 
                    Binds: binds, 
                    Memory: 256 * 1024 * 1024
                },
                WorkingDir: "/app",
                ...(cmd && { Cmd: cmd }),
            });

            return container.id;
        } catch (err) {
            this._throwError(`Erreur de creation : ${err.message}`, ErrorCodes.PROVIDER_ERROR);
        }
    }

    async startContainer(containerId) {
        if (!containerId) this._throwError("ID du conteneur manquant", ErrorCodes.PROVIDER_ERROR);

        try {
            const container = this.#docker.getContainer(containerId);
            const info = await container.inspect();

            if (!info.State.Running) {
                await container.start();
                this._logInfo(`Conteneur ${containerId} demarrer avec succes`);
            }
            return true;
        } catch (err) {
            this._throwError(`Echec du demarrage : ${err.message}`, ErrorCodes.PROVIDER_ERROR);
        }
    }

    async stopContainer(containerId) {
        if (!containerId) return false;

        try {
            const container = this.#docker.getContainer(containerId);
            await container.stop();
            this._logInfo(`Conteneur ${containerId} arreter`);
            return true;
        } catch (error) {
            if (error.statusCode === 304) return true;
            this._throwError(`Erreur lors de l'arrêt : ${error.message}`, ErrorCodes.PROVIDER_ERROR);
        }
    }

    async destroyContainer(containerId) {
        if (!containerId) return false;

        try {
            const container = this.#docker.getContainer(containerId);
            const info = await container.inspect();

            if (info.State.Running) await container.stop();
            await container.remove();

            this._logInfo(`Conteneur ${containerId} détruit`);
            return true;
        } catch (err) {
            this._logInfo(`Impossible de detruire ${containerId} : ${err.message}`);
            return false;
        }
    }

    async pullImage(version) {
        if (this.#env === "dev") {
            this._logInfo("Mode DEV : Pas de pull d'image");
            return true;
        }

        const imageToUse = this.#getImageName(version);
        this._logInfo(`Telechargement de la nouvelle image ${imageToUse}...`);

        return new Promise((resolve, reject) => {
            this.#docker.pull(imageToUse, (err, stream) => {
                if (err) {
                    return reject(new Error(`Erreur lors de l'initiation du pull Docker: ${err.message}`));
                }

                const onFinished = (pullErr, output) => {
                    if (pullErr) {
                        return reject(new Error(`Echec du telechargement de l'image: ${pullErr.message}`));
                    }
                    resolve(true);
                }

                this.#docker.modem.followProgress(stream, onFinished);
            });
        });
    }

    async checkContainerExist(containerId) {
        if (!containerId) return false;

        try {
            const container = this.#docker.getContainer(containerId);
            await container.inspect();
            return true;
        } catch (err) {
            if (err.statusCode === 404) return false;
            this._throwError(`Erreur inspection Docker : ${err.message}`, ErrorCodes.PROVIDER_ERROR);
        }
    }
    
    async fetchTagsFromHub() {
        const repoName = process.env.BOT_IMAGE_PROD; 

        try {
            const response = await fetch(`https://hub.docker.com/v2/repositories/${repoName}/tags/?page_size=15`);
            if (!response.ok) throw new Error("Docker Hub injoignable");

            const data = await response.json();

            return data.results
                .filter(tag => tag.name !== 'latest')
                .map(tag => ({
                    name: tag.name,
                    date: new Date(tag.tag_last_pushed)
                }));

        } catch (error) {
            this._logError(`Erreur recuperation tags Docker Hub: ${error.message}`);
            return [];
        }
    }
}

module.exports = DockerProvider;