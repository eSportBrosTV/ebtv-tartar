const { User, AssoMember } = require("../../models")
const ApiResponse = require("../../utils/ApiResponse")
const catchAsync = require("../../utils/catchAsync")

const addMember = catchAsync(async (req, res, next) => {
    const userId = req.body.user
    const orgId = req.params.orgId

    if (!await User.exists({ _id: userId })) {
        throw new AppError("Utilisateur introuvable", 404)
    }

    const newMember = new AssoMember({
        user: userId,
        orga: orgId
    })

    if (req.body.role) {
        newMember.role = req.body.role
    }

    await newMember.save()

    ApiResponse.created(res, newMember, "Membre ajouter")
})

const getMembers = catchAsync(async (req, res, next) => {
    const orgId = req.params.orgId

    const members = await AssoMember.find({ orga: orgId })

    ApiResponse.ok(res, members)
})

module.exports = {
    addMember,
    getMembers,
}