const GlobalError = require("../../utils/errors/GlobalError");

class BaseService{
    #serviceName
    constructor(serviceName) {
        this.#serviceName = serviceName;
    }

    _logInfo(message){
        console.log(`[${this.#serviceName}] ${message}`)
    }

    _logError(message){
        console.error(`[${this.#serviceName}]`, message)
    }

    _throwError(message, code) {
        throw new GlobalError(`[${this.#serviceName}] ${message}`, code);
    }
}

module.exports = BaseService;