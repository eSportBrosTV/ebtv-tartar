const { Command } = require("../models")

const factory = require("../utils/crudFactory")

module.exports = {
    addCommand: factory.createOne(Command),
    getCommand: factory.getOne(Command)
}