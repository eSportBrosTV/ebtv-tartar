const { orgaService } = require("../../services")
const ApiResponse = require("../../utils/ApiResponse")
const catchAsync = require("../../utils/catchAsync")

const addMember = catchAsync(async (req, res, next) => {
    const newMember = await orgaService.members.create({
        orga: req.ctx.orga._id,
        ...req.body
    })

    ApiResponse.created(res, newMember, "Membre ajouter")
})

const getMembers = catchAsync(async (req, res, next) => {
    const members = await orgaService.members.getAllOfOrga(req.ctx.orga._id)

    ApiResponse.ok(res, members)
})

module.exports = {
    addMember,
    getMembers,
}
