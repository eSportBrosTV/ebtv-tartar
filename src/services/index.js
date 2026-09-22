const { Command, User } = require("../models");

const DataService = require("./core/DataService");
const BotCommandDataService = require("./data/BotCommandDataService");
const BotDataService = require("./data/BotDataService");
const OrgaDataService = require("./data/OrgaDataService");
const ReleaseDataService = require("./data/ReleaseDataService");
const BotCommandService = require("./domain/bot/BotCommandService");
const BotConfigService = require("./domain/bot/BotConfigService");

const BotDeploymentService = require("./domain/bot/BotDeploymentService");
const BotManagementService = require("./domain/bot/BotManagementService");
const CommandManagementService = require("./domain/command/CommandManagementService");
const ReleaseService = require("./domain/release/ReleaseService");
const AuthService = require("./domain/user/AuthService");
const UserManagementService = require("./domain/user/UserManagementService");

const DockerProvider = require("./providers/DockerProvider");
const SocketProvider = require("./providers/SocketProvider");

const commandData = new DataService(Command)
const userData = new DataService(User)

const botData = new BotDataService()
const orgaData = new OrgaDataService()
const botCommandData = new BotCommandDataService()
const releaseData = new ReleaseDataService()

const dockerProvider = new DockerProvider()
const socketProvider = new SocketProvider()

const botDeployment = new BotDeploymentService(botData, releaseData, dockerProvider, socketProvider)
const botConfig = new BotConfigService(botData, orgaData, commandData, botCommandData)
const botManagement = new BotManagementService(botData, botConfig, socketProvider)
const botCommand = new BotCommandService(botCommandData, botConfig, socketProvider)

const userManagement = new UserManagementService(userData, socketProvider)
const userAuth = new AuthService(userManagement)

const commandManagement= new CommandManagementService(commandData, socketProvider)

const releaseService = new ReleaseService(releaseData, dockerProvider)

const botService = {
    deploy: botDeployment,
    manage: botManagement,
    config: botConfig,
    commands: botCommand
}

const userService = {
    auth: userAuth,
    manage: userManagement
}

const commandService = {
    manage: commandManagement
}

module.exports = {
    botService,
    userService,
    commandService,
    releaseService,
    providers : {
        socketProvider: socketProvider
    }
}