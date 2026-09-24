const { orgaService } = require("../../services")
const ApiResponse = require("../../utils/ApiResponse")
const catchAsync = require("../../utils/catchAsync")

const addOrga = catchAsync(async (req, res, next) => {
    const newOrga = await orgaService.manage.create(req.body)

    ApiResponse.created(res, newOrga)
})

module.exports = {
    addOrga
}
