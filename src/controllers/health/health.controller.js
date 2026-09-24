const { systemService } = require("../../services");
const ApiResponse = require("../../utils/ApiResponse");
const catchAsync = require("../../utils/catchAsync");

const getHealth = catchAsync((req, res, next) => {
  const { isHealthy, services } = systemService.health.getStatus();

  const statusCode = isHealthy ? 200 : 503;
  const message = isHealthy
    ? "Systeme opérationnel"
    : "Service en panne";

  const data = {
    isHealthy,
    services,
    timestamp: new Date().toISOString(),
  };

  ApiResponse.custom(res, statusCode, data, message);
});

module.exports = {
  getHealth,
};
