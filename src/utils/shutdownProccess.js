const { botService } = require("../services")

module.exports = async () => {
    console.log("[Stop] Arret en cours..")

    await botService.presence.resetAll()

    process.exit(0)
}
