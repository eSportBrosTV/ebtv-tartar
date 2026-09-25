const ApiResponse = require("../../utils/ApiResponse");
const catchAsync = require("../../utils/catchAsync");
const { botService } = require("../../services");

const getBot = catchAsync(async (req, res,next) => {
    ApiResponse.ok(res, req.ctx.bot)
})

const getBotToken = catchAsync(async (req, res, next) => {
    const token = await botService.manage.getDiscordToken(req.ctx.bot)

    res.set('Cache-Control', 'no-store')
    ApiResponse.ok(res, { token })
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
    await botService.lifecycle.destroy(req.ctx.bot, req.body.force)
    ApiResponse.ok(res, null, "Bot supprimer avec succer")
});

const updateImageBot = catchAsync(async (req,res,next) => {
    await botService.deploy.updateBot(req.ctx.bot)
    ApiResponse.accepted(res, null, "Mise a jour lancer avec succes")
})

module.exports = {
    startBot,
    stopBot,
    destroyBot,
    getBot,
    getBotToken,
    updateBot,
    updateImageBot
}