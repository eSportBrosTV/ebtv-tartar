const mongoose = require('mongoose');

module.exports = function foreignKeyPlugin(schema) {
    for (const pathName in schema.paths) {
        const path = schema.paths[pathName];

        if ((path.instance === 'ObjectId' || path.instance === 'ObjectID') && path.options && path.options.ref) {
            const refModel = path.options.ref;
            

            path.validators.push({
                validator: async function (value) {
                    if (!value) return true;
                    
                    try {
                        const exists = await mongoose.model(refModel).exists({ _id: value });
                        return exists !== null;
                    } catch (err) {
                        return false; 
                    }
                },
                message: `L'ID n'existe pas dans la collection '${refModel}'.`
            });
        }
    }
};