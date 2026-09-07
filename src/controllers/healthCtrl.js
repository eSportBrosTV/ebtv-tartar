const healthMonitor = require("../services/healthMonitor");
const ApiResponse = require("../utils/ApiResponse");
const catchAsync = require("../utils/catchAsync");

const getHealth = catchAsync((req, res, next) => {
  const statusCode = healthMonitor.isHealthy ? 200 : 503;
  const message = healthMonitor.isHealthy
    ? "Systeme opérationnel"
    : "Service en panne";

  const data = {
    isHealthy: healthMonitor.isHealthy,
    services: healthMonitor.services,
    timestamp: new Date().toISOString(),
  };

  ApiResponse.custom(res, statusCode, data, message);
});

module.exports = {
  getHealth,
};
