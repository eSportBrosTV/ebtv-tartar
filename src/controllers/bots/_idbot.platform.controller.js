const { botService } = require("../../services");
const ApiResponse = require("../../utils/ApiResponse");
const catchAsync = require("../../utils/catchAsync");

const getPlatform = catchAsync(async (req,res,next) => {
    const platform = await botService.config.getPlatformChoice(req.ctx.bot)
    ApiResponse.ok(res, platform)
})

const setPlatform = catchAsync(async (req,res,next) => {
    const platform = await botService.platform.set(req.ctx.bot, req.body)
    ApiResponse.ok(res, platform)
})

module.exports = {
    getPlatform,
    setPlatform
}
