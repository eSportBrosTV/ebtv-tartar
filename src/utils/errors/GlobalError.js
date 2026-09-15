class GlobalError extends Error {
    constructor(message, code){
        super(message)
        this.name = "GlobalError"
        this.code = code
    }
}

module.exports = GlobalError