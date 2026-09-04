const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const inject = (configs) => catchAsync(async (req, res, next) => {
    
    const fetchPromises = configs.map(async (config) => {
        const id = req.params[config.param];
        
        if (!id) return null; 

        const doc = await config.model.findById(id);

        if (!doc) {
            throw new AppError(`Ressource introuvable`, 404);
        }

        return { key: config.key, doc: doc };
    });

    const results = await Promise.all(fetchPromises);

    results.forEach(result => {
        if (result) {
            req[result.key] = result.doc;
        }
    });
    next();
});

module.exports = inject;