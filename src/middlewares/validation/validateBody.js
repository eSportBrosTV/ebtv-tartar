const AppError = require("../../utils/appError")

module.exports = (schema) => (req,res,next) => {
    console.log(req.body)
    try{
        req.body = schema.parse(req.body)
        next()
    } catch(err) {
        throw new AppError("Corp de requete invalide", 400)
    }
}