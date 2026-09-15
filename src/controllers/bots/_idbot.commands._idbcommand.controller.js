const { botService } = require("../../services");
const ApiResponse = require("../../utils/ApiResponse");
const catchAsync = require("../../utils/catchAsync");

const getCommand = catchAsync(async (req,res,next) => {
    ApiResponse.ok(res, req.ctx.botCommand)
})

const updateCommand = catchAsync(async (req,res,next) => {
    const updatedCommand = await botService.commands.update(req.ctx.botCommand, req.body)
    ApiResponse.ok(res, updatedCommand)
})

const deleteCommand = catchAsync(async (req,res,next) => {
    await botService.commands.delete(req.ctx.botCommand)
    ApiResponse.ok(res, null, "Command de bot supprimer !")
})

module.exports = {
    getCommand,
    updateCommand,
    deleteCommand
}