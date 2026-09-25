const { BotRelease } = require("../../models");
const DataService = require("../core/DataService");

class ReleaseDataService extends DataService {
    constructor(){
        super(BotRelease)
    }

    async getLatestRelease() {
        try {
            const latestRel = await this.model.findOne().sort({releaseDate: -1})

            return latestRel ? latestRel.version : 'latest'
        } catch (error) {
            this.handleMongoError(error)
        }
    }
}

module.exports = ReleaseDataService