const { userService } = require("../../services");
const ApiResponse = require("../../utils/ApiResponse");
const catchAsync = require("../../utils/catchAsync");

const getUser = catchAsync(async (req,res,next) => {
    ApiResponse.ok(res, req.ctx.user)
})

const updateUser = catchAsync(async (req,res,next) => {
    const updatedUser = await userService.manage.updateById(req.ctx.user._id, req.body)

    ApiResponse.ok(res, updatedUser)
})

const deleteUser = catchAsync(async (req,res,next) => {
    await userService.manage.deleteById(req.ctx.user._id)

    ApiResponse.ok(res, null, "Utilisateur supprimer")
})

module.exports = {
    getUser,
    updateUser,
    deleteUser
}