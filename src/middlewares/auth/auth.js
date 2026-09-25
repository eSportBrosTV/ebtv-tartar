const { userService } = require("../../services")
const AppError = require("../../utils/errors/appError")

module.exports = (req,res,next) => {

    if(!req.isAuthenticated()){

        if(req.session){
            return req.session.destroy(() => {
                res.clearCookie('connect.sid', {path: '/'})
                next(new AppError("Acces refuser, vous n'etes pas connecter", 401))
            })
        }

        return next(new AppError("Acces refuser, vous n'etes pas connecter", 401))
    }

    if(req.session && !userService.auth.isSessionCurrent(req.user, req.session.sessionVersion)){
        return req.logout((err) => {
            if(err) return next(err)

            req.session.destroy(() => {
                res.clearCookie('connect.sid', {path: '/'})
                return next(new AppError("Votre mot de passe a changer. Veuiller vous reconnecter", 401))
            })
        })
    }

    next()
}