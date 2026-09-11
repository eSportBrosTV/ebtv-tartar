const ApiResponse = require("../../utils/ApiResponse")
const catchAsync = require("../../utils/catchAsync")

const getOrga = catchAsync(async (req,res,next) => {
    ApiResponse.ok(res, req.ctx.orga)
})

module.exports = {
    getOrga
}