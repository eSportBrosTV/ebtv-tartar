const catchAsync = require("../../utils/catchAsync")
const ApiResponse = require("../../utils/ApiResponse")
const { userService } = require("../../services")

const register = catchAsync(async (req, res, next) => {
    let newUser = await userService.auth.register(req.body)

    ApiResponse.created(res, newUser)
})

const login = catchAsync(async (req, res, next) => {
    req.session.sessionVersion = req.user.sessionVersion

    ApiResponse.ok(res, req.user)
})

const logout = catchAsync(async (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err)

        req.session.destroy((err) => {
            if (err) return next(err)

            res.clearCookie('connect.sid', { path: '/' })

            ApiResponse.ok(res, null, "Deconnecter")
        })
    })
})

module.exports = {
    register,
    login,
    logout
}