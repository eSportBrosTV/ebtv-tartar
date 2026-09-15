const { botService } = require("../../services");
const ApiResponse = require("../../utils/ApiResponse");
const catchAsync = require("../../utils/catchAsync");

const addCommand = catchAsync(async (req,res,next) => {
    const newCommand = await botService.commands.create({
        bot_id: req.ctx.bot._id,
        ...req.body
    })
    ApiResponse.created(res, newCommand)
})

const getCommands = catchAsync(async (req,res,next) => {
    const commands = await botService.commands.getAllOfBot(req.ctx.bot._id)
    ApiResponse.ok(res, commands)
})

module.exports = {
    addCommand,
    getCommands
}