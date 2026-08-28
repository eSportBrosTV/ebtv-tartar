const setBodyParams = (paramsMap) => {
    return (req, res, next) => {
        for (const [bodyField, paramName] of Object.entries(paramsMap)) {
            if (!req.body[bodyField] && req.params[paramName]) {
                req.body[bodyField] = req.params[paramName];
            }
        }
        next();
    };
};

module.exports = setBodyParams