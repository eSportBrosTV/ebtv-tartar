const ApiResponse = require("../../utils/ApiResponse");
const catchAsync = require("../../utils/catchAsync");
const { botService } = require("../../services");

const getBot = catchAsync(async (req, res,next) => {
    ApiResponse.ok(res, req.ctx.bot)
})

const updateBot = catchAsync(async (req,res,next) => {
    const updatedBot = await botService.manage.update(req.ctx.bot, req.body)
    ApiResponse.ok(res, updatedBot)
})

const startBot = catchAsync(async (req, res, next) => {
    await botService.deploy.startBot(req.ctx.bot)
    ApiResponse.ok(res, null, "Bot demarer")
});

const stopBot = catchAsync(async (req, res, next) => {
    await botService.deploy.stopBot(req.ctx.bot)
    ApiResponse.ok(res, null, "Bot stopper");
});

const destroyBot = catchAsync(async (req, res, next) => {
    await botService.deploy.destroyBot(req.ctx.bot, req.body.force)
    ApiResponse.ok(res, null, "Bot supprimer avec succer")
});

module.exports = {
    startBot,
    stopBot,
    destroyBot,
    getBot,
    updateBot
}