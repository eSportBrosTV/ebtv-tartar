const AppError = require("../utils/appError")

module.exports = (req,res,next) => {
    throw new AppError("Route non implementer", 501)
}