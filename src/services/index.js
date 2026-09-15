const { Command, User } = require("../models");

const DataService = require("./core/DataService");
const BotCommandDataService = require("./data/BotCommandDataService");
const BotDataService = require("./data/BotDataService");
const OrgaDataService = require("./data/OrgaDataService");
const BotCommandService = require("./domain/bot/BotCommandService");
const BotConfigService = require("./domain/bot/BotConfigService");

const BotDeploymentService = require("./domain/bot/BotDeploymentService");
const BotManagementService = require("./domain/bot/BotManAgementService");
const AuthService = require("./domain/user/AuthService");

const DockerProvider = require("./providers/DockerProvider");
const SocketProvider = require("./providers/SocketProvider");

const commandData = new DataService(Command)
const userData = new DataService(User)

const botData = new BotDataService()
const orgaData = new OrgaDataService()
const botCommandData = new BotCommandDataService()

const dockerProvider = new DockerProvider()
const socketProvider = new SocketProvider()

const botDeployment = new BotDeploymentService(botData, dockerProvider, socketProvider)
const botConfig = new BotConfigService(botData, orgaData, commandData, botCommandData)
const botManagement = new BotManagementService(botData, botConfig, socketProvider)
const botCommand = new BotCommandService(botCommandData, botConfig, socketProvider)

const userAuth = new AuthService(userData)

const botService = {
    deploy: botDeployment,
    manage: botManagement,
    config: botConfig,
    commands: botCommand
}

const userService = {
    auth: userAuth,
    manage: userData
}

module.exports = {
    botService,
    userService,
    providers : {
        socketProvider: socketProvider
    }
}