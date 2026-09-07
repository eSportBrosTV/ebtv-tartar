class ApiResponse {
    constructor(res, statusCode = 200, data = null, message = null, meta = null) {
        this.res = res;
        this.statusCode = statusCode;
        
        this.payload = {
            status: statusCode >= 200 && statusCode < 400 ? 'success' : 'error'
        };

        if (message) this.payload.message = message;
        if (data !== undefined && data !== null) this.payload.data = data;
        if (meta) this.payload.meta = meta;
    }

    send() {
        if (this.statusCode === 204) {
            return this.res.status(204).send();
        }
        return this.res.status(this.statusCode).json(this.payload);
    }

    static ok(res, data = null, message = null) {
        return new ApiResponse(res, 200, data, message).send();
    }

    static created(res, data = null, message = null) {
        return new ApiResponse(res, 201, data, message).send();
    }

    static noContent(res) {
        return new ApiResponse(res, 204).send();
    }

    static paginated(res, data, meta, message = null) {
        return new ApiResponse(res, 200, data, message, meta).send();
    }

    static custom(res, statusCode, data, message, meta) {
        return new ApiResponse(res, statusCode, data, message, meta).send();
    }
}

module.exports = ApiResponse;