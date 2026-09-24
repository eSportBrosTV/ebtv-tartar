const EventEmitter = require('events');
const BaseService = require('../../core/BaseService');
const DockerProvider = require('../../providers/DockerProvider');
const SocketProvider = require('../../providers/SocketProvider');
const DatabaseProvider = require('../../providers/DatabaseProvider');
const DiscordWebhookProvider = require('../../providers/DiscordWebhookProvider');

const FAILURE_THRESHOLD = 2;
const COLOR_OK = 3066993;
const COLOR_DOWN = 15158332;

class HealthService extends BaseService {
    #docker
    #socket
    #database
    #discord
    #events = new EventEmitter()
    #interval = null
    #isHealthy = true
    #services = { docker: true, database: true, websocket: true }
    #failures = { docker: 0, database: 0, websocket: 0 }

    /**
     * @param {DockerProvider} dockerProvider
     * @param {SocketProvider} socketProvider
     * @param {DatabaseProvider} databaseProvider
     * @param {DiscordWebhookProvider} discordProvider
     */
    constructor(dockerProvider, socketProvider, databaseProvider, discordProvider) {
        super('Health');
        this.#docker = dockerProvider;
        this.#socket = socketProvider;
        this.#database = databaseProvider;
        this.#discord = discordProvider;
    }

    get isHealthy() {
        return this.#isHealthy;
    }

    getStatus() {
        return {
            isHealthy: this.#isHealthy,
            services: { ...this.#services }
        };
    }

    onStatusChanged(listener) {
        this.#events.on('status_changed', listener);
    }

    start(intervalMs = 7000) {
        if (this.#interval) return;

        this.#interval = setInterval(() => {
            this.#checkServices().catch(err => this._logError(err));
        }, intervalMs);
    }

    stop() {
        clearInterval(this.#interval);
        this.#interval = null;
    }

    async #checkServices() {
        const results = {
            docker: await this.#docker.ping(),
            database: this.#database.isConnected(),
            websocket: this.#socket.isReady()
        };

        for (const [name, isUp] of Object.entries(results)) {
            this.#failures[name] = isUp ? 0 : this.#failures[name] + 1;
            this.#services[name] = this.#failures[name] < FAILURE_THRESHOLD;
        }

        const isHealthy = Object.values(this.#services).every(Boolean);
        if (isHealthy === this.#isHealthy) return;

        this.#isHealthy = isHealthy;

        if (isHealthy) {
            await this.#onRecovery();
        } else {
            await this.#onFailure();
        }

        this.#events.emit('status_changed', this.getStatus());
    }

    async #onFailure() {
        const failedList = Object.keys(this.#services).filter(name => !this.#services[name]);
        this._logError(`Services defaillants : [${failedList.join(", ")}]`);

        this.#socket.disconnectAll();
        this._logInfo("Tous les sockets ont ete coupes");

        await this.#sendAlert({
            title: "Panne détectée",
            description: "Mise en securité de TarTar les route API ont etait bloquer et les socket fermer",
            color: COLOR_DOWN
        });
    }

    async #onRecovery() {
        this._logInfo("Systeme de nouveau 100% operationnel");

        await this.#sendAlert({
            title: "✅ Système Rétabli",
            description: "Tous les services (DB, WebSocket, Docker) refonctionnent normalement.",
            color: COLOR_OK
        });
    }

    async #sendAlert({ title, description, color }) {
        const fields = Object.entries(this.#services).map(([name, isUp]) => ({
            name: name.toUpperCase(),
            value: isUp ? "🟢 Opérationnel" : "🔴 Hors service",
        }));

        await this.#discord.sendEmbed({
            title,
            description,
            color,
            fields,
            timestamp: new Date().toISOString()
        });
    }
}

module.exports = HealthService;
