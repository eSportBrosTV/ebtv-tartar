const { Orga } = require("../models")

const factory = require("../utils/crudFactory")

module.exports = {
    addOrga: factory.createOne(Orga),
    getOrga: factory.getOne(Orga)
}