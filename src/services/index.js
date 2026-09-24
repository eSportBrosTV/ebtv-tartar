const { Command, User } = require("../models");

const DataService = require("./core/DataService");
const AssoMemberDataService = require("./data/AssoMemberDataService");
const BotCommandDataService = require("./data/BotCommandDataService");
const BotDataService = require("./data/BotDataService");
const OrgaDataService = require("./data/OrgaDataService");
const ReleaseDataService = require("./data/ReleaseDataService");
const BotCommandService = require("./domain/bot/BotCommandService");
const BotConfigService = require("./domain/bot/BotConfigService");

const BotDeploymentService = require("./domain/bot/BotDeploymentService");
const BotLifecycleService = require("./domain/bot/BotLifecycleService");
const BotManagementService = require("./domain/bot/BotManagementService");
const CommandManagementService = require("./domain/command/CommandManagementService");
const OrgaManagementService = require("./domain/orga/OrgaManagementService");
const OrgaMemberService = require("./domain/orga/OrgaMemberService");
const ReleaseService = require("./domain/release/ReleaseService");
const HealthService = require("./domain/system/HealthService");
const AuthService = require("./domain/user/AuthService");
const UserManagementService = require("./domain/user/UserManagementService");

const DatabaseProvider = require("./providers/DatabaseProvider");
const DiscordWebhookProvider = require("./providers/DiscordWebhookProvider");
const DockerProvider = require("./providers/DockerProvider");
const SocketProvider = require("./providers/SocketProvider");

const commandData = new DataService(Command)
const userData = new DataService(User)

const botData = new BotDataService()
const orgaData = new OrgaDataService()
const botCommandData = new BotCommandDataService()
const releaseData = new ReleaseDataService()
const assoMemberData = new AssoMemberDataService()

const dockerProvider = new DockerProvider()
const socketProvider = new SocketProvider()
const databaseProvider = new DatabaseProvider()
const discordWebhookProvider = new DiscordWebhookProvider()

const botDeployment = new BotDeploymentService(botData, releaseData, dockerProvider, socketProvider)
const botConfig = new BotConfigService(botData, orgaData, commandData, botCommandData)
const botManagement = new BotManagementService(botData, botConfig, socketProvider)
const botCommand = new BotCommandService(botCommandData, botConfig, socketProvider)
const botLifecycle = new BotLifecycleService(botManagement, botDeployment)

const userManagement = new UserManagementService(userData, socketProvider)
const userAuth = new AuthService(userManagement)

const commandManagement= new CommandManagementService(commandData, socketProvider)

const orgaManagement = new OrgaManagementService(orgaData)
const orgaMember = new OrgaMemberService(assoMemberData, userData)

const releaseService = new ReleaseService(releaseData, dockerProvider)

const healthService = new HealthService(dockerProvider, socketProvider, databaseProvider, discordWebhookProvider)

const botService = {
    deploy: botDeployment,
    manage: botManagement,
    config: botConfig,
    commands: botCommand,
    lifecycle: botLifecycle
}

const userService = {
    auth: userAuth,
    manage: userManagement
}

const commandService = {
    manage: commandManagement
}

const orgaService = {
    manage: orgaManagement,
    members: orgaMember
}

const systemService = {
    health: healthService
}

module.exports = {
    botService,
    userService,
    commandService,
    orgaService,
    releaseService,
    systemService,
    providers : {
        socketProvider: socketProvider
    }
}