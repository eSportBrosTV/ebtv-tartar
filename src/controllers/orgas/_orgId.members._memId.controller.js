const { AssoMember } = require("../../models")
const ApiResponse = require("../../utils/ApiResponse")
const catchAsync = require("../../utils/catchAsync")

const getMember = catchAsync(async (req, res, next) => {
    ApiResponse.ok(res, req.ctx.orgaMember)
})

const deleteMember = catchAsync(async (req, res, next) => {
    const memId = req.ctx.orgaMember.id

    await AssoMember.deleteOne({ _id: memId })

    ApiResponse.ok(res, null, "Membre supprimer")
})

const updateMember = catchAsync(async (req, res, next) => {
    const memId = req.ctx.orgaMember.id
    const updateData = req.body

    let updatedMember = await AssoMember.findByIdAndUpdate(memId, { $set: updateData }, { new: true })

    ApiResponse.ok(res, updatedMember)
})

module.exports = {
    getMember,
    deleteMember,
    updateMember
}