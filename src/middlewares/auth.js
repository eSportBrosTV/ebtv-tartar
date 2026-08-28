module.exports = (req,res,next) => {
    if(req.isAuthenticated()){
        return next()
    }

    const err = new Error("Accès refusé. Veuillez vous connecter.");
    err.statusCode = 401;
    next(err);
}