const catchAsync = require("../../utils/catchAsync");
const ApiResponse = require("../../utils/ApiResponse");
const { botService } = require("../../services");

const getBots = catchAsync(async (req,res,next) => {
  const bots = await botService.manage.getAll()

  ApiResponse.ok(res, bots)
})

const addBot = catchAsync(async (req, res, next) => {
  const newBot = await botService.manage.create(req.body)

  try {
    await botService.deploy.deployBot(newBot, true)

    ApiResponse.created(res, newBot, "Bot creer et demarer")
  } catch (err) {

    const response = new ApiResponse(res, 201, newBot, "Bot creer mais non demarer")
    response.payload.status = "partial";
    response.send();

  }
})


module.exports = {
  getBots,
  addBot,
};
