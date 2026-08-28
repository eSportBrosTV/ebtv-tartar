const { Bot } = require("../models")

module.exports = async () => {
    console.log("[Stop] Arret en cours..")

    await Bot.updateMany({}, {isOnline: false})

    process.exit(0)
}