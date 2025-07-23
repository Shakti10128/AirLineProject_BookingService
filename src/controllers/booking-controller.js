const {BookingService} = require("../services/index");
const {StatusCodes} = require('http-status-codes');
const successResponse = require("../utils/successResponse");

const bookingService = new BookingService();

const create = async(req,res,next)=>{
    try {
        const response = await bookingService.createBooking(req.body);   
        return successResponse(res,StatusCodes.CREATED,response,"Flight booked successfully");
    } catch (error) {
        next(error);
    }
}


module.exports = {
    create
}