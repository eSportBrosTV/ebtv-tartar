const { BotCommand } = require("../../models");
const DataService = require("../core/DataService");

class BotCommandDataService extends DataService {
    constructor() {
        super(BotCommand); 
    }

    async findCommandsByBot(botId) {
        return await this.model.find({ bot_id: botId });
    }

    async findCommandsByGlobal(globalCmdId){
        return await this.model.find({command_id: globalCmdId})
    }
}

module.exports = BotCommandDataService;