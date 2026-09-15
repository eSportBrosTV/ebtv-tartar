const AppError = require("../../utils/errors/appError")

module.exports = (schema) => (req,res,next) => {
    try{
        req.body = schema.parse(req.body)
        next()
    } catch(err) {
        throw new AppError("Corp de requete invalide", 400)
    }
}