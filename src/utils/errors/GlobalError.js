class GlobalError extends Error {
    constructor(message, code, details){
        super(message)
        this.name = "GlobalError"
        this.code = code
        this.details = details
    }
}

module.exports = GlobalError
