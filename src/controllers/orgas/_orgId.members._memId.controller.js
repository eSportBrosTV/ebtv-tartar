const { orgaService } = require("../../services")
const ApiResponse = require("../../utils/ApiResponse")
const catchAsync = require("../../utils/catchAsync")

const getMember = catchAsync(async (req, res, next) => {
    ApiResponse.ok(res, req.ctx.orgaMember)
})

const deleteMember = catchAsync(async (req, res, next) => {
    await orgaService.members.delete(req.ctx.orgaMember)

    ApiResponse.ok(res, null, "Membre supprimer")
})

const updateMember = catchAsync(async (req, res, next) => {
    const updatedMember = await orgaService.members.update(req.ctx.orgaMember, req.body)

    ApiResponse.ok(res, updatedMember)
})

module.exports = {
    getMember,
    deleteMember,
    updateMember
}
