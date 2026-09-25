const { rateLimit } = require("express-rate-limit")
const AppError = require("../../utils/errors/appError")

module.exports = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    skipSuccessfulRequests: true,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    handler: (req, res, next) => {
        next(new AppError("Trop de tentatives de connexion. Reessayez dans 15 minutes", 429))
    }
})
