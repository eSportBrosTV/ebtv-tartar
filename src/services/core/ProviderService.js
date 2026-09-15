const ErrorCodes = require("../../utils/errors/ErrorCodes");
const BaseService = require("./BaseService");

class ProviderService extends BaseService {
    constructor(providerName) {
        super(providerName);
    }

    async _withRetry(operation, maxRetries = 3) {
        let attempt = 0;
        while (attempt < maxRetries) {
            try {
                return await operation();
            } catch (error) {
                attempt++;
                this._logInfo(`Echec reseau. Tentative ${attempt}/${maxRetries}`);
                if (attempt === maxRetries) this._throwError("Service externe injoignable", ErrorCodes.PROVIDER_DOWN);
                await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt - 1)));
            }
        }
    }
}
module.exports = ProviderService;