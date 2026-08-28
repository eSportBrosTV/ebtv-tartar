module.exports = {
    commands: {
        create: require("./command/create")
    },
    orga: {
        create: require("./orga/create")
    },
    bot: {
        create: require("./bot/create"),
        commandCreate: require('./bot/commandCreate')
    },
    user: {
        create: require("./users/create"),
        login: require("./users/login")
    }
}