const ErrorCodes = require('../../utils/errors/ErrorCodes');
const BaseService = require('./BaseService');

/**
 * @template T
 */
class DataService extends BaseService {
    /**
     * @param {import('mongoose').Model<T>} model
     */
    constructor(model) {
        super(`${model.modelName}Data`);
        this.model = model;
    }

    /**
     * @param {string} id
     * @returns {Promise<T | null>}
     */
    async findById(id) {
        try {
            return await this.model.findById(id);
        } catch (error) {
            this.handleMongoError(error);
        }
    }

    async exist(filter = {}){
        try {
            const existingDoc = await this.model.exists(filter)
            if(!existingDoc) {
                return false
            } else {
                return true
            }
        } catch (error) {
            this.handleMongoError(error);
        }
    }

    /**
     * @param {string} id
     * @returns {Promise<T | null>}
     */
    async findByIdOrThrow(id, message = "Document introuvable") {
        const doc = await this.findById(id)

        if (!doc) {
            this._throwError(message, ErrorCodes.NOT_FOUND)
        }
        return doc
    }

    /**
     * @param {import('mongoose').QueryFilter<T>} filter
     * @returns {Promise<T | null>}
     */
    async findOne(filter) {
        try {
            return await this.model.findOne(filter);
        } catch (error) {
            this.handleMongoError(error);
        }
    }

    /**
     * @param {import('mongoose').QueryFilter<T>} [filter={}]
     * @returns {Promise<Array<T>>}
     */
    async find(filter = {}) {
        try {
            return await this.model.find(filter);
        } catch (error) {
            this.handleMongoError(error);
        }
    }

    /**
     * @param {Partial<T>} payload 
     * @param {import('mongoose').ClientSession} [session=null]
     * @returns {Promise<T>}
     */
    async create(payload, session = null) {
        try {
            const docs = await this.model.create([payload], { session });
            return docs[0];
        } catch (error) {
            this.handleMongoError(error);
        }
    }

    /**
     * @param {string} id
     * @param {import('mongoose').UpdateQuery<T>} payload
     * @param {import('mongoose').ClientSession} [session=null]
     * @returns {Promise<T>}
     */
    async updateById(id, payload, session = null) {
        try {
            const updatedDoc = await this.model.findByIdAndUpdate(
                id,
                { $set: payload },
                { new: true, runValidators: true, session }
            );

            if (!updatedDoc) {
                this._throwError("Document introuvable pour la mise à jour", ErrorCodes.NOT_FOUND);
            }

            return updatedDoc;
        } catch (error) {
            this.handleMongoError(error);
        }
    }

    /**
     * @param {import('mongoose').QueryFilter<T>} filter
     * @param {import('mongoose').UpdateQuery<T>} payload
     * @param {import('mongoose').ClientSession} [session=null]
     */
    async updateMany(filter, payload, session = null) {
        try {
            return await this.model.updateMany(
                filter,
                { $set: payload },
                { runValidators: true, session }
            );
        } catch (error) {
            this.handleMongoError(error);
        }
    }

    /**
     * @param {string} id
     * @param {import('mongoose').ClientSession} [session=null]
     * @returns {Promise<T>}
     */
    async deleteById(id, session = null) {
        try {
            const deletedDoc = await this.model.findByIdAndDelete(id, { session });

            if (!deletedDoc) {
                this._throwError("Document introuvable pour la suppression", ErrorCodes.NOT_FOUND);
            }

            return deletedDoc;
        } catch (error) {
            this.handleMongoError(error);
        }
    }

    handleMongoError(error) {
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            this._throwError(`Format d'identifiant invalide : ${error.value}`, ErrorCodes.BAD_REQUEST);
        }

        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            this._throwError(`Le champ '${field}' doit etre unique. La valeur '${error.keyValue[field]}' existe deja`, ErrorCodes.CONFLICT);
        }

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message).join(', ');
            this._throwError(`Erreur de validation : ${messages}`, ErrorCodes.BAD_REQUEST);
        }

        if (error.isOperational) {
            throw error;
        }

        console.error(error)
        this._logInfo(`[CRASH MONGOOSE] ${error.message}`);
        this._throwError("Erreur interne de la base de donnees", ErrorCodes.BAD_REQUEST);
    }
}

module.exports = DataService;