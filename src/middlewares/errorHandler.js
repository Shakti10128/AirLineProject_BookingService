// middlewares/errorHandler.js
const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/appError');
const errorResponse = require("../utils/errorResponse")

const errorHandler = (err, req, res, next) => {
    let customError = err;

    // Handle Sequelize validation errors
    if (err.name === 'SequelizeValidationError') {
        const messages = err.errors.map(e => ({
            field: e.path,
            reason: e.message
        }));
        customError = new AppError(
            "Validation failed",
            StatusCodes.BAD_REQUEST,
            { validationErrors: messages }
        );
    }

    // Handle unique constraint violation
    if (err.name === 'SequelizeUniqueConstraintError') {
        const field = err.errors[0].path;
        customError = new AppError(
            "Duplicate entry",
            StatusCodes.BAD_REQUEST,
            {
                field: field,
                reason: "must be unique"
            }
        );
    }


    // Fallback if it's not already AppError
    if (!(customError instanceof AppError)) {
        customError = new AppError(
            err.message || "Internal Server Error",
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }

    return errorResponse(res, customError.statusCode, customError.message, customError);
};

module.exports = errorHandler;
