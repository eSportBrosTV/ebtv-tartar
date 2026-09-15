const AppError = require("../../utils/errors/appError")

module.exports = (req,res,next) => {
    throw new AppError("Route non implementer", 501)
}