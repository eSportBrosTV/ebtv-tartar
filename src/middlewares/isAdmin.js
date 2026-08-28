const catchAsync = require('../utils/catchAsync');

module.exports = catchAsync((req,res,next) => {
    if(req.user.roles != 'admin') {
        const err = new Error("Acces refuse");
        err.statusCode = 401;
        throw err;
    }

    next()
})