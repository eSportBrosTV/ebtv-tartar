const { commandService } = require("../../services")
const ApiResponse = require("../../utils/ApiResponse")
const catchAsync = require("../../utils/catchAsync")

const addCommand = catchAsync(async (req,res,next) => {
    const newCommand = await commandService.manage.create(req.body)

    ApiResponse.created(res, newCommand)
})

const getCommands = catchAsync(async (req,res,next) => {
    const commands = await commandService.manage.getAll()

    ApiResponse.ok(res, commands)
})

module.exports = {
    getCommands,
    addCommand
}