const { Bot } = require("../../models");
const factory = require("../../utils/crudFactory");
const catchAsync = require("../../utils/catchAsync");
const dockerService = require("../../services/dockerService");
const jwt = require("jsonwebtoken");
const ApiResponse = require("../../utils/ApiResponse");

const addBot = catchAsync(async (req, res, next) => {
  const newBot = new Bot(req.body);

  const botJwt = jwt.sign(
    {
      orca_id: newBot.id,
      created_at: Date.now(),
    },
    process.env.JWT_SECRET
  );

  let newContainerId = await dockerService.createContainer({
    botId: newBot.id,
    tartarToken: botJwt,
    disToken: newBot.token,
  });

  newBot.containerId = newContainerId;

  await newBot.save();

  let isStarted = await dockerService.startContainer(newContainerId);

  if (isStarted) {
    ApiResponse.created(res, newBot, "Bot creer et demarer");
  } else {
    const response = new ApiResponse(
      res,
      201,
      newBot,
      "Bot creer mais non demarer"
    );
    response.payload.status = "partial";

    response.send();
  }
});

module.exports = {
  getBots: factory.getAll(Bot),
  addBot,
};
