const discordService = {
    async sendDiscordAlert ({ isHealthy, services, title, color, description }) {
        
        const fields = Object.entries(services).map(([name, status]) => ({
            name: name.toUpperCase(),
            value: status ? "🟢 Opérationnel" : "🔴 Hors service",
        }));
    
        const embed = {
            title: title,
            description: description,
            color: color,
            fields: fields,
            timestamp: new Date().toISOString()
        };
    
        try {
            await fetch(process.env.DISCORD_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ embeds: [embed] })
            });
        } catch (err) {
            console.error("[Discord] Erreur lors de l'envoi du webhook :", err.message);
        }
    }
}

module.exports = discordService;