const { userService } = require("../../services");
const ApiResponse = require("../../utils/ApiResponse");
const catchAsync = require("../../utils/catchAsync");

const getMe = catchAsync(async (req,res,next) => {
    ApiResponse.ok(res, req.user)
})

const updateMe = catchAsync(async (req,res,next) => {
    const updatedMe = await userService.manage.update(req.user, req.body)

    ApiResponse.ok(res, updatedMe)
})

module.exports = {
    getMe,
    updateMe
}
