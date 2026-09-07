module.exports = {
    commands: {
        create: require("./command/create")
    },
    orga: {
        create: require("./orga/create"),
        addMember: require("./orga/addMember")
    },
    bot: {
        create: require("./bot/create"),
        commandCreate: require('./bot/commandCreate'),
        destroy: require('./bot/destroy')
    },
    user: {
        create: require("./users/create"),
        login: require("./users/login")
    }
}