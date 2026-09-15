const AppError = require('../../utils/errors/appError');
const ErrorCodes = require('../../utils/errors/ErrorCodes');

const handleCastErrorDB = err => {
    const message = `Invalide ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
    const value = Object.values(err.keyValue)[0];
    const message = `La valeur '${value}' existe déjà. Veuillez utiliser une autre valeur.`;
    return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Données invalides : ${errors.join('. ')}`;
    return new AppError(message, 400);
};

const translateGlobalError = (code) => {
    switch (code) {
        case ErrorCodes.BAD_REQUEST: return 400;
        case ErrorCodes.NOT_FOUND: return 404;
        
        case ErrorCodes.CONFLICT: return 
        case ErrorCodes.BAD_STATE: return 409;
        
        case ErrorCodes.PROVIDER_ERROR:
        case ErrorCodes.PROVIDER_DOWN: return 502;
        
        case ErrorCodes.PROVIDER_TIMEOUT: return 504;
        
        case ErrorCodes.DATABASE_ERROR:
        case ErrorCodes.BOT_STOP_FAILED: return 500;
        
        default: return 500;
    }
};


module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.ENVEX === 'dev') {
        res.status(err.statusCode).json({
            status: err.status,
            code: err.code || undefined,
            error: err,
            message: err.message,
            stack: err.stack
        });
    } else {
        let error = Object.assign(err);

        if (error.name === 'CastError') error = handleCastErrorDB(error);
        
        if (error.code === 11000) error = handleDuplicateFieldsDB(error);
        
        if (error.name === 'ValidationError') error = handleValidationErrorDB(error);

        if(error.code && Object.values(ErrorCodes).includes(error.code)){
            error.statusCode = translateGlobalError(error.code)
            error.status = error.statusCode >= 500 ? 'error' : 'fail'
            error.isOperational = true
        }

        if (error.isOperational) {
            res.status(error.statusCode).json({
                status: error.status,
                code: error.code || undefined,
                message: error.message
            });
        } else {
            console.error('ERREUR NON PRÉVUE :', err);
            res.status(500).json({
                status: 'error',
                message: 'Une erreur interne est survenue.'
            });
        }
    }
};