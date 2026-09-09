const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");


const authorize = (policyFn) => catchAsync(async (req, res, next) => {
    if(req.user && req.user.roles === "admin"){
        return next()
    }

    const result = await policyFn(req);

    if (result !== true) {
        const errorMessage = typeof result === 'string' ? result : "Accès refusé.";
        return next(new AppError(errorMessage, 403));
    }

    next();
});

module.exports = authorize;