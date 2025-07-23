const {StatusCodes} = require("http-status-codes");
const AppError = require("../utils/appError");

const validateBookingCreateReq = (req,res,next)=>{
    const requireFields = ["userId","flightId","noOfSeats"];
    for(const field of requireFields) {
        if(!req.body.hasOwnProperty(field)) {
            throw new AppError(`Required field ${field} is missing`,StatusCodes.BAD_REQUEST,"can't process the request");
        }
    };

    next();
}

module.exports = {
    validateBookingCreateReq
}