const AppError = require('../../utils/errors/appError');
const catchAsync = require('../../utils/catchAsync');

module.exports = catchAsync((req,res,next) => {
    if(req.user.roles != 'admin') {
        throw new AppError("Acces refuser", 403)
    }

    next()
})