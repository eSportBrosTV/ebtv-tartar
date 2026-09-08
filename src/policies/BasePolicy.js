/**
 * @typedef {true | string} PolicyResult
 */
class BasePolicy {
    /**
     * @template T
     * @param {import('express').Request} req 
     * @param {string} cacheKey 
     * @param {() => Promise<T>} fetchFn 
     * @returns {Promise<T>}
     */
    async _getCached(req, cacheKey, fetchFn) {
        req.ctx = req.ctx || {};
        
        if (req.ctx[cacheKey] !== undefined) {
            return req.ctx[cacheKey];
        }

        const data = await fetchFn();
        req.ctx[cacheKey] = data;
        return data;
    }
}

module.exports = BasePolicy;