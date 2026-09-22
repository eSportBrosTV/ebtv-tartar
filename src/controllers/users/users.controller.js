const { userService } = require("../../services");
const ApiResponse = require("../../utils/ApiResponse");
const catchAsync = require("../../utils/catchAsync");

const getAllUsers = catchAsync(async (req,res,next) => {
    const users = await userService.manage.getAll()

    ApiResponse.ok(res, users)
})

module.exports = {
    getAllUsers
}