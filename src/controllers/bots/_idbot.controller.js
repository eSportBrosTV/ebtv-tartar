const { getIO } = require("../../config/socket");
const dockerService = require("../../services/dockerService");
const ApiResponse = require("../../utils/ApiResponse");
const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");

async function emitStopAndWait(botId, force = false) {
    let botRep = null;

    try {
        const rep = await getIO()
            .of("/bots")
            .timeout(5000)
            .to(botId)
            .emitWithAck("stop");

        botRep = rep[0];
    } catch (err) {
        console.error(err);
        if (!force) {
            throw new AppError("Le bot ne repond pas", 504);
        }
    }

    if (botRep && !botRep.success && !force) {
        throw new AppError("Le bot n'as pas reussi a s'arreter", 502);
    }
}

const getBot = catchAsync(async (req, res,next) => {
    ApiResponse.ok(res, req.ctx.bot)
})

const startBot = catchAsync(async (req, res, next) => {
    const containerId = req.ctx.bot.containerId;

    if (!(await dockerService.checkContainerExist(containerId))) {
        throw new AppError(`Le conteneur du bot ${bot.id} n'existe pas`, 404);
    }

    if (!(await dockerService.startContainer(containerId))) {
        throw new AppError(`Impossible de demarer le bot`, 500);
    }

    ApiResponse.ok(res, null, "Bot demarer");
});

const stopBot = catchAsync(async (req, res, next) => {
    const bot = req.ctx.bot;

    await emitStopAndWait(bot.id);

    if (!(await dockerService.stopContainer(bot.containerId))) {
        throw new AppError(`Arret impossible`, 500);
    }

    ApiResponse.ok(res, null, "Bot stopper");
});

const destroyBot = catchAsync(async (req, res, next) => {
    const bot = req.ctx.bot;

    await emitStopAndWait(bot.id, req.body.force);

    if (!(await dockerService.destroyContainer(bot.containerId))) {
        throw new AppError("Impossible de detruir le conteneur du bot", 500);
    }

    await bot.deleteOne();

    ApiResponse.ok(res, null, "Bot supprimer avec succer")
});

module.exports = {
    startBot,
    stopBot,
    destroyBot,
    getBot
}