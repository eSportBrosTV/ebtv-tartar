const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('./ApiResponse');
const AppError = require('./appError');

exports.createOne = (Model) => catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    ApiResponse.created(res, doc)
});

exports.getAll = (Model) => catchAsync(async (req, res, next) => {
    const filter = req.filterObj || {}; 
    
    const docs = await Model.find(filter);

    ApiResponse.ok(res, docs)
});

exports.getOne = (Model, populateOptions) => catchAsync(async (req, res, next) => {
    const queryFilter = { ...(req.filterObj || {}) };
    
    if (req.params.id) {
        queryFilter._id = req.params.id;
    }
    
    let query = Model.findOne(queryFilter);
    
    if (populateOptions) query = query.populate(populateOptions);
    
    const doc = await query;

    if (!doc) {
        throw new AppError("Ressource introuvable", 404)
    }

    ApiResponse.ok(res, doc)
});

exports.updateOne = (Model) => catchAsync(async (req, res, next) => {
    
    const queryFilter = { ...(req.filterObj || {}) };
    
    if (req.params.id) {
        queryFilter._id = req.params.id;
    }

    const doc = await Model.findOneAndUpdate(queryFilter, req.body, {
        new: true,
        runValidators: true
    });

    if (!doc) throw new AppError("Ressource introuvable", 404)

    ApiResponse.ok(res, doc)
});

exports.deleteOne = (Model) => catchAsync(async (req, res, next) => {
    const queryFilter = { ...(req.filterObj || {}) };
    
    if (req.params.id) {
        queryFilter._id = req.params.id;
    }

    const doc = await Model.findOneAndDelete(queryFilter);

    if (!doc) {
        throw new AppError("Ressource introuvable", 404)
    }

    ApiResponse.ok(res)
});