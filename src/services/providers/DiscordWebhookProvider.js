const ProviderService = require('../core/ProviderService');

class DiscordWebhookProvider extends ProviderService {
    #webhookUrl

    constructor() {
        super('DiscordWebhook');
        this.#webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    }

    async sendEmbed(embed) {
        if (!this.#webhookUrl) {
            this._logInfo("DISCORD_WEBHOOK_URL absent, alerte non envoyee");
            return false;
        }

        try {
            const response = await fetch(this.#webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ embeds: [embed] })
            });

            if (!response.ok) {
                this._logError(`Webhook refuse par Discord (${response.status})`);
                return false;
            }

            return true;
        } catch (err) {
            this._logError(`Erreur lors de l'envoi du webhook : ${err.message}`);
            return false;
        }
    }
}

module.exports = DiscordWebhookProvider;
