const { BotRelease } = require("../../models");
const DataService = require("../core/DataService");

class ReleaseDataService extends DataService {
    constructor(){
        super(BotRelease)
    }

    async getLatestRelease() {
        const latestRel = await this.model.findOne().sort({releaseDate: -1})

        return latestRel ? latestRel.version : 'latest'
    }
}

module.exports = ReleaseDataService