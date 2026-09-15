const AppError = require("../../utils/errors/appError")

module.exports = (req,res,next) => {
    if(req.isAuthenticated()){
        return next()
    }

    throw new AppError("Acces refuser, vous n'etes pas connecter", 401)
}