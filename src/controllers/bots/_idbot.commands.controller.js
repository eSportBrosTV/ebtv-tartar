const { getIO } = require("../../config/socket");
const { BotCommand } = require("../../models");
const { configGenerator } = require("../../services/configGenerator");
const ApiResponse = require("../../utils/ApiResponse");

const addCommand = catchAsync(async (req, res, next) => {
    const orcaId = req.ctx.bot.id;

    const newCommandBot = await BotCommand.findOneAndUpdate(
        {
            bot_id: orcaId,
            command_id: req.body.command_id,
        },
        req.body,
        {
            new: true,
            upsert: true,
        }
    );

    let newConf = await configGenerator(orcaId);

    getIO().of("/bots").to(orcaId).emit("update_config", newConf);

    ApiResponse.created(res, newCommandBot);
});

module.exports = {
    addCommand
}