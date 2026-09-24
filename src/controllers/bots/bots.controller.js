const catchAsync = require("../../utils/catchAsync");
const ApiResponse = require("../../utils/ApiResponse");
const { botService } = require("../../services");

const getBots = catchAsync(async (req,res,next) => {
  const bots = await botService.manage.getAll()

  ApiResponse.ok(res, bots)
})

const addBot = catchAsync(async (req, res, next) => {
  const { bot, deployed } = await botService.lifecycle.create(req.body)

  if (!deployed) {
    const response = new ApiResponse(res, 201, bot, "Bot creer mais non demarer")
    response.payload.status = "partial";
    return response.send();
  }

  ApiResponse.created(res, bot, "Bot creer et demarer")
})


module.exports = {
  getBots,
  addBot,
};
