
const successResponse = (res, statusCode, data, message = "Success") => {
    return res.status(statusCode).json({
        data,
        success: true,
        message,
        err: {}
    });
};

module.exports = successResponse;
