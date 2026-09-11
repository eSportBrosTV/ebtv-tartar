const catchAsync = require("../../utils/catchAsync")
const { User } = require("../../models")
const AppError = require("../../utils/appError")
const ApiResponse = require("../../utils/ApiResponse")

const register = catchAsync(async (req,res,next) => {
    if(!req.user.roles.includes("admin")){
        throw new AppError("Acces refuser", 403)
    }

    let newUser = await User.create(req.body)

    newUser.password = undefined

    ApiResponse.created(res, newUser)
})

const login = catchAsync(async (req,res,next) => {
    ApiResponse.ok(res, req.user)
})

const logout = catchAsync(async (req,res,next) => {
    req.logout((err) => {
        if(err) return next(err)
        ApiResponse.ok(res, null, "Deconnecter")
    })
})

const me = catchAsync(async (req,res,next) => {
    ApiResponse.ok(res, req.user)
})

module.exports = {
    register,
    login,
    logout,
    me
}