const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');

const injectCtx = (configs) => catchAsync(async (req, res, next) => {
    
    const fetchPromises = configs.map(async (config) => {
        const id = req.params[config.param];
        
        if (!id) return null; 

        let query = config.model.findById(id);

        if (config.select) {
            query = query.select(config.select);
        }

        const doc = await query;

        if (!doc) {
            throw new AppError(`Ressource introuvable`, 404);
        }

        return { key: config.key, doc: doc };
    });

    const results = await Promise.all(fetchPromises);

    req.ctx = req.ctx || {};

    results.forEach(result => {
        if (result) {
            req.ctx[result.key] = result.doc;
        }
    });
    
    next();
});

module.exports = injectCtx;