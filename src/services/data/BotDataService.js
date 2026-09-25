const { Bot } = require("../../models");
const DataService = require("../core/DataService");

class BotDataService extends DataService {
    constructor() {
        super(Bot); 
    }

    async findBotByOrga(orgId) {
        return await this.find({ orga: orgId });
    }
}

module.exports = BotDataService;