const { Orga } = require("../../models");
const DataService = require("../core/DataService");

class OrgaDataService extends DataService {
    constructor(){
        super(Orga)
    }
}

module.exports = OrgaDataService