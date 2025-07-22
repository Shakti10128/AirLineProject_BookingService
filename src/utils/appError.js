const { StatusCodes } = require('http-status-codes');

class AppError extends Error {
    constructor(message, statusCode = StatusCodes.INTERNAL_SERVER_ERROR, err = null) {
        super(message);
        this.statusCode = statusCode;
        this.success = false;
        this.message = message; // keeps message explicit
        this.err = err || message; // structured object or fallback to message
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;
