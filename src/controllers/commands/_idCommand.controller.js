const { commandService } = require("../../services");
const ApiResponse = require("../../utils/ApiResponse");
const catchAsync = require("../../utils/catchAsync");

const getCommand = catchAsync(async (req,res,next) => {
    ApiResponse.ok(res, req.ctx.command)
})

const updateCommand = catchAsync(async (req,res,next) => {
    const updatedCommand = await commandService.manage.update(req.ctx.command, req.body)

    ApiResponse.ok(res, updatedCommand)
})

const deleteCommand = catchAsync(async (req,res,next) => {
    await commandService.manage.delete(req.ctx.command)

    ApiResponse.ok(res, null, "Commande supprimer")
})

module.exports = {
    getCommand,
    updateCommand,
    deleteCommand
}