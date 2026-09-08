const setFilters = (filtersMap) => {
    return (req, res, next) => {
        req.filterObj = req.filterObj || {};

        for (const [dbField, paramName] of Object.entries(filtersMap)) {
            if (req.params[paramName]) {
                req.filterObj[dbField] = req.params[paramName];
            }
        }

        next();
    };
};

module.exports = setFilters;