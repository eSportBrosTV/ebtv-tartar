const AppError = require("../../utils/errors/appError")
const zodErrorDetails = require("../../utils/errors/zodErrorDetails")

module.exports = (schema) => (req,res,next) => {
    const result = schema.safeParse(req.body)

    if (!result.success) {
        throw new AppError("Corp de requete invalide", 400, zodErrorDetails(result.error))
    }

    req.body = result.data
    next()
}
