const catchAsync = require("../utils/catchAsync")
const { User } = require("../models")
const AppError = require("../utils/appError")

const register = catchAsync(async (req,res,next) => {
    if(!req.user.roles.includes("admin")){
        throw new AppError("Acces refuser", 403)
    }

    let newUser = await User.create(req.body)

    newUser.password = undefined

    res.status(201).json({
        status: 'succes',
        data: newUser
    })
})

const login = catchAsync(async (req,res,next) => {
    res.status(200).json({ 
        status: 'success', 
        data: req.user 
    });
})

const logout = catchAsync(async (req,res,next) => {
    req.logout((err) => {
        if(err) return next(err)

        res.status(200).json({ 
            status: 'success', 
            message: 'Deconnecter'
        });
    })
})

const me = catchAsync(async (req,res,next) => {
    res.status(200).json({
        status: 'succes',
        data: req.user
    })
})

module.exports = {
    register,
    login,
    logout,
    me
}