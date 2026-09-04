const AppError = require('../utils/appError');

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


module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.ENVEX === 'dev') {
        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        });
    } else {
        let error = Object.assign(err);

        if (error.name === 'CastError') error = handleCastErrorDB(error);
        
        if (error.code === 11000) error = handleDuplicateFieldsDB(error);
        
        if (error.name === 'ValidationError') error = handleValidationErrorDB(error);

        if (error.isOperational) {
            res.status(error.statusCode).json({
                status: error.status,
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