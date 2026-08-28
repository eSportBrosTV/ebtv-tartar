const catchAsync = require('../utils/catchAsync');

const verifExist = (configs) => catchAsync(async (req, res, next) => {
    
    const checkPromises = configs.map(async (config) => {
        const id = req.params[config.param];
        
        if (!id) return null; 

        const isExist = await config.model.exists({_id: id});

        if (!isExist) {
            const err = new Error(`Ressource introuvable pour le parametre: ${config.param}`);
            err.statusCode = 404;
            throw err;
        }
    });

    await Promise.all(checkPromises);

    next();
});

module.exports = verifExist;