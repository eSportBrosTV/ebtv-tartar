const catchAsync = require('../utils/catchAsync');

const inject = (configs) => catchAsync(async (req, res, next) => {
    
    const fetchPromises = configs.map(async (config) => {
        const id = req.params[config.param];
        
        if (!id) return null; 

        const doc = await config.model.findById(id);

        if (!doc) {
            const err = new Error(`Ressource introuvable pour le parametre: ${config.param}`);
            err.statusCode = 404;
            throw err;
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