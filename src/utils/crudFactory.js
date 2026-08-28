const catchAsync = require('../utils/catchAsync');

exports.createOne = (Model) => catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
        status: 'success',
        data: doc
    });
});

exports.getAll = (Model) => catchAsync(async (req, res, next) => {
    const filter = req.filterObj || {}; 
    
    const docs = await Model.find(filter);

    res.status(200).json({
        status: 'success',
        results: docs.length,
        data: docs
    });
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
        throw Object.assign(new Error('Aucun document trouver avec cet ID (ou acces refuse)'), { statusCode: 404 });
    }

    res.status(200).json({
        status: 'success',
        data: doc
    });
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

    if (!doc) throw Object.assign(new Error('Aucun document trouve'), { statusCode: 404 });

    res.status(200).json({ status: 'success', data: doc });
});

exports.deleteOne = (Model) => catchAsync(async (req, res, next) => {
    const queryFilter = { ...(req.filterObj || {}) };
    
    if (req.params.id) {
        queryFilter._id = req.params.id;
    }

    const doc = await Model.findOneAndDelete(queryFilter);

    if (!doc) {
        throw Object.assign(new Error('Aucun document trouve avec cet ID (ou acces refuse)'), { statusCode: 404 });
    }

    res.status(204).json({
        status: 'success',
        data: null 
    });
});