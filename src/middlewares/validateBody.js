module.exports = (schema) => (req,res,next) => {
    console.log(req.body)
    try{
        req.body = schema.parse(req.body)
        next()
    } catch(err) {
        return res.status(400).json({
            message: "Corp de requete invalide",
            errors: err.errors
        })
    }
}